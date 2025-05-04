"use server";

import { auth } from "@/auth";
import { callOpenRouter } from "@/lib/openrouter";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { redirect } from "next/navigation";

// Define the expected structure of the AI's JSON response
interface GeneratedProductContent {
  product_name: string;
  persuasive_description: string;
  main_promise: string;
  offer_copy: string;
  ad_copy_facebook: string;
  ad_copy_instagram: string;
  ad_copy_google: string;
  vsl_script: string;
  landing_page_structure: string;
  titles_suggestions: string;
  cta_suggestions: string;
  target_audience_suggestion: string;
}

// Helper function to generate the prompt for the AI
function generatePrompt(type: 'niche' | 'idea', input: string): string {
  const commonInstructions = `
    Gere o seguinte conteúdo de marketing para um produto digital. Responda APENAS com um objeto JSON válido contendo as seguintes chaves (sem texto adicional antes ou depois do JSON):
    - product_name: Nome criativo e atraente para o produto.
    - persuasive_description: Descrição curta e persuasiva (2-3 frases).
    - main_promise: A principal promessa ou transformação que o produto oferece.
    - offer_copy: Texto para a seção de oferta da página de vendas.
    - ad_copy_facebook: Copy curto para anúncio no Facebook Ads.
    - ad_copy_instagram: Copy curto para anúncio no Instagram Ads (pode incluir sugestões de hashtags).
    - ad_copy_google: Copy curto para anúncio no Google Ads (focado em palavras-chave).
    - vsl_script: Estrutura básica/roteiro resumido para um Vídeo de Vendas (VSL).
    - landing_page_structure: Sugestão de estrutura/seções para a landing page.
    - titles_suggestions: 3 sugestões de títulos chamativos para o produto ou anúncios.
    - cta_suggestions: 3 sugestões de Call-to-Action (CTA) para botões.
    - target_audience_suggestion: Breve descrição do público-alvo ideal.
  `;

  if (type === 'niche') {
    return `
      ${commonInstructions}
      O nicho do produto é: ${input}
    `;
  } else {
    return `
      ${commonInstructions}
      Baseie-se na seguinte descrição de produto/ideia: ${input}
    `;
  }
}

// Helper function to parse the AI's JSON response safely
function parseAIResponse(jsonString: string): GeneratedProductContent | null {
  try {
    // Remove potential markdown code block fences
    const cleanedJsonString = jsonString.replace(/^```json\n|\n```$/g, '');
    const parsed = JSON.parse(cleanedJsonString);
    // Basic validation (can be expanded)
    if (parsed && typeof parsed === 'object' && parsed.product_name) {
      return parsed as GeneratedProductContent;
    }
    console.error("Parsed JSON does not match expected structure:", parsed);
    return null;
  } catch (error) {
    console.error("Failed to parse AI response JSON:", error, "Raw response:", jsonString);
    return null;
  }
}

export async function createProductAction(formData: FormData): Promise<{ success: boolean; error?: string; productId?: number }> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const creationType = formData.get("creationType") as 'niche' | 'idea';
  const niche = formData.get("niche") as string | null;
  const ideaDescription = formData.get("ideaDescription") as string | null;
  const userEmail = session.user.email;

  if (!creationType || (creationType === 'niche' && !niche) || (creationType === 'idea' && !ideaDescription)) {
    return { success: false, error: "Dados de entrada inválidos." };
  }

  const input = creationType === 'niche' ? niche! : ideaDescription!;

  // --- Database Interaction (Placeholder - Requires D1 setup) ---
  let userId: number | null = null;
  let userPlan: string = 'gratuito';
  let productCount: number = 0;

  try {
    const { env } = getRequestContext();
    const db = env.DB_LOCAL; // Use DB_LOCAL for development

    // 1. Get User ID and check plan/limits
    const userResult = await db.prepare("SELECT id, plan, product_count FROM users WHERE email = ?").bind(userEmail).first<{ id: number; plan: string; product_count: number }>();

    if (!userResult) {
      // Optionally create user if they don't exist (e.g., first login via magic link)
      // For now, assume user exists after login
      return { success: false, error: "Usuário não encontrado no banco de dados." };
    }

    userId = userResult.id;
    userPlan = userResult.plan;
    productCount = userResult.product_count;

    if (userPlan === 'gratuito' && productCount >= 2) {
      return { success: false, error: "Limite de produtos atingido no plano gratuito." };
    }

    // --- Call AI API ---
    const prompt = generatePrompt(creationType, input);
    const aiResponse = await callOpenRouter(prompt);

    if (!aiResponse) {
      return { success: false, error: "Falha ao gerar conteúdo com IA. Tente novamente." };
    }

    // --- Parse AI Response ---
    const generatedContent = parseAIResponse(aiResponse);

    if (!generatedContent) {
      return { success: false, error: "Falha ao processar a resposta da IA. Formato inesperado." };
    }

    // --- Save Product to Database ---
    const insertResult = await db.prepare(
      `INSERT INTO products (user_id, niche, idea_description, product_name, persuasive_description, main_promise, offer_copy, ad_copy_facebook, ad_copy_instagram, ad_copy_google, vsl_script, landing_page_structure, titles_suggestions, cta_suggestions, target_audience_suggestion, cover_image_placeholder, ad_creative_placeholder) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      userId,
      creationType === 'niche' ? niche : null,
      creationType === 'idea' ? ideaDescription : null,
      generatedContent.product_name,
      generatedContent.persuasive_description,
      generatedContent.main_promise,
      generatedContent.offer_copy,
      generatedContent.ad_copy_facebook,
      generatedContent.ad_copy_instagram,
      generatedContent.ad_copy_google,
      generatedContent.vsl_script,
      generatedContent.landing_page_structure,
      generatedContent.titles_suggestions,
      generatedContent.cta_suggestions,
      generatedContent.target_audience_suggestion,
      `/placeholders/cover-${userId}-${Date.now()}.png`, // Placeholder image paths
      `/placeholders/ad-${userId}-${Date.now()}.png`
    ).run();

    const newProductId = insertResult.meta.last_row_id;

    if (!newProductId) {
        return { success: false, error: "Falha ao salvar o produto no banco de dados." };
    }

    // --- Update User Product Count (if free plan) ---
    if (userPlan === 'gratuito') {
      await db.prepare("UPDATE users SET product_count = product_count + 1 WHERE id = ?").bind(userId).run();
    }

    // --- Return Success ---
    // Use revalidatePath or redirect after successful creation
    // redirect(`/produto/${newProductId}`); // Redirect on success
    return { success: true, productId: newProductId };

  } catch (error: any) {
    console.error("Error in createProductAction:", error);
    return { success: false, error: error.message || "Erro interno do servidor." };
  }
}

// Placeholder for manual upgrade request action
export async function requestManualUpgrade(): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Usuário não autenticado." };
    }
    // In a real scenario, this would trigger a notification (e.g., email, Slack) to an admin
    // Or update a status in the database for the admin to review
    console.log(`Manual upgrade requested for user: ${session.user.email}`);
    // Simulate success
    return { success: true };
}

// Placeholder for fetching user data (replace mock in page.tsx)
export async function getUserPlanAndCount(email: string): Promise<{ plan: string; productCount: number }> {
    try {
        const { env } = getRequestContext();
        const db = env.DB_LOCAL;
        const userResult = await db.prepare("SELECT plan, product_count FROM users WHERE email = ?").bind(email).first<{ plan: string; product_count: number }>();
        if (userResult) {
            return { plan: userResult.plan, productCount: userResult.product_count };
        }
        // Handle case where user might not exist yet (e.g., first login)
        return { plan: 'gratuito', productCount: 0 }; 
    } catch (error) {
        console.error("Error fetching user plan/count:", error);
        return { plan: 'gratuito', productCount: 0 }; // Default on error
    }
}

// Placeholder for fetching product data (replace mock in page.tsx)
export async function getProductById(id: number, userEmail: string): Promise<any | null> {
    try {
        const { env } = getRequestContext();
        const db = env.DB_LOCAL;
        // Fetch product AND verify ownership by joining with users table
        const productResult = await db.prepare(
            `SELECT p.* FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ? AND u.email = ?`
        ).bind(id, userEmail).first();
        
        return productResult || null;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

// Placeholder for deleting a product
export async function deleteProductAction(productId: number): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Usuário não autenticado." };
    }
    try {
        const { env } = getRequestContext();
        const db = env.DB_LOCAL;
        // Verify ownership before deleting
        const productOwner = await db.prepare("SELECT u.email FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ?").bind(productId).first<{ email: string }>();
        if (!productOwner || productOwner.email !== session.user.email) {
            return { success: false, error: "Acesso negado ou produto não encontrado." };
        }

        // Delete the product
        await db.prepare("DELETE FROM products WHERE id = ?").bind(productId).run();
        
        // Decrement user's product count if they were on free plan (optional, depends on logic)
        // Consider if deleting should free up a slot on the free plan
        // await db.prepare("UPDATE users SET product_count = MAX(0, product_count - 1) WHERE email = ? AND plan = 'gratuito'").bind(session.user.email).run();

        // Revalidate dashboard path
        // revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        console.error(`Error deleting product ${productId}:`, error);
        return { success: false, error: "Erro ao deletar produto." };
    }
}

// Placeholder for fetching all products for dashboard
export async function getProductsForUser(userEmail: string): Promise<any[]> {
     try {
        const { env } = getRequestContext();
        const db = env.DB_LOCAL;
        const productsResult = await db.prepare(
            `SELECT p.id, p.product_name, p.created_at FROM products p JOIN users u ON p.user_id = u.id WHERE u.email = ? ORDER BY p.created_at DESC`
        ).bind(userEmail).all();
        
        return productsResult.results || [];
    } catch (error) {
        console.error(`Error fetching products for user ${userEmail}:`, error);
        return [];
    }
}


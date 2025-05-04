import ProductView from '@/components/product/product-view';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getProductById } from '@/lib/product-data'; // Placeholder for data fetching function
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await auth();
  const productId = parseInt(params.id, 10);

  if (!session?.user?.email) {
    redirect('/login');
  }

  if (isNaN(productId)) {
    // Handle invalid ID
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
        <h1 className="text-2xl text-red-500 mb-4">ID de Produto Inválido</h1>
        <Link href="/dashboard">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Fetch product data - Ensure this function checks ownership
  const product = await getProductById(productId, session.user.email);

  if (!product) {
    // Handle product not found or not owned by user
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
        <h1 className="text-2xl text-yellow-500 mb-4">Produto não encontrado ou acesso negado.</h1>
        <Link href="/dashboard">
          <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
             <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <Link href="/dashboard" className="mb-6 inline-block">
         <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
         </Button>
      </Link>
      <ProductView product={product} />
    </div>
  );
}

// Placeholder function - Implement actual data fetching later
async function getProductById(id: number, userEmail: string): Promise<any | null> {
  console.log(`Fetching product ${id} for user ${userEmail}...`); // Log for dev
  // Replace with actual D1 database query, including user_id check
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async call
  // Mock data for now - Replace with real structure
  if (id === 1) { // Simulate finding a product
    return {
      id: 1,
      user_id: 1, // Assume this matches the logged-in user
      niche: 'Emagrecimento', 
      product_name: 'Plano Detox 7 Dias',
      persuasive_description: 'Perca peso rapidamente com nosso plano detox exclusivo de 7 dias. Sinta-se mais leve e energizado!',
      main_promise: 'Perca até 3kg em 7 dias de forma saudável.',
      offer_copy: 'Oferta especial de lançamento! Adquira o Plano Detox 7 Dias por apenas R$47. Inclui guia completo, receitas e suporte.',
      ad_copy_facebook: 'Cansada de dietas que não funcionam? Experimente o Plano Detox 7 Dias e veja resultados reais em uma semana! Clique para saber mais.',
      ad_copy_instagram: 'Transforme seu corpo em 7 dias! ✨ Nosso Plano Detox é o empurrão que você precisa. Link na bio! #detox #emagrecimento #vidasaudavel',
      ad_copy_google: 'Plano Detox Emagrecer Rápido - Perca peso em 7 dias com nosso método comprovado. Resultados garantidos. Compre agora!',
      vsl_script: 'Roteiro VSL: [Introdução chocante sobre dificuldade de emagrecer] -> [Apresentação da solução: Plano Detox 7 Dias] -> [Prova social/depoimentos] -> [Detalhes da oferta] -> [Chamada para ação urgente]',
      landing_page_structure: 'Estrutura LP: [Headline com promessa forte] -> [Vídeo de Vendas] -> [Benefícios detalhados] -> [Depoimentos] -> [O que você recebe] -> [Bônus] -> [Garantia] -> [Preço e botão de compra]',
      titles_suggestions: 'Sugestões Títulos: Detox Milagroso; O Segredo do Emagrecimento Rápido; 7 Dias Para Mudar Seu Corpo',
      cta_suggestions: 'Sugestões CTA: Quero Emagrecer Agora!; Sim, Quero Meu Plano Detox!; Começar Transformação Hoje!',
      target_audience_suggestion: 'Público Alvo: Mulheres, 25-45 anos, que tentaram outras dietas sem sucesso, buscam resultados rápidos, interessadas em saúde e bem-estar.',
      cover_image_placeholder: '/placeholders/cover-detox.png', // Placeholder path
      ad_creative_placeholder: '/placeholders/ad-detox.png', // Placeholder path
      created_at: new Date().toISOString(),
    };
  }
  return null; // Simulate not found
}


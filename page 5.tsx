import ProductCreationForm from '@/components/product/product-creation-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserPlanAndCount } from '@/lib/user-data'; // Placeholder for data fetching function

export default async function CreateProductPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/login');
  }

  // Fetch user plan and product count to double-check limits
  // This logic might be better placed in the API route handling the creation
  // but checking here prevents unnecessary UI rendering if limit is reached.
  const { plan, productCount } = await getUserPlanAndCount(session.user.email);

  const canCreate = plan === 'pago' || productCount < 2;

  if (!canCreate) {
    // Redirect back to dashboard or show a specific message page
    redirect('/dashboard?limit_reached=true'); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
       <header className="mb-8">
         <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500">Criar Novo Produto Digital com IA</h1>
         <p className="text-gray-400 mt-2">Escolha como deseja começar: informe um nicho ou cole a descrição de uma ideia existente.</p>
       </header>
       <ProductCreationForm />
    </div>
  );
}

// Placeholder function - Implement actual data fetching later
async function getUserPlanAndCount(email: string): Promise<{ plan: string; productCount: number }> {
    console.log(`Fetching plan and count for ${email}...`); // Log for dev
    // Replace with actual D1 database query
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async call
    // Mock data for now
    return { plan: 'gratuito', productCount: 0 }; 
}


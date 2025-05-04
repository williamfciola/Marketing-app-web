import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { auth } from '@/auth'; // Assuming auth config is set up
import { redirect } from 'next/navigation';
import { getProductsForUser, getUserPlanAndCount } from '@/actions/product-actions'; // Import actual data fetching functions

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/login');
  }

  // Fetch user data and products
  const userEmail = session.user.email;
  const [{ plan, productCount }, products] = await Promise.all([
    getUserPlanAndCount(userEmail),
    getProductsForUser(userEmail)
  ]);

  return (
    <DashboardLayout 
      userEmail={userEmail} 
      products={products} 
      plan={plan} 
      productCount={productCount} 
    />
  );
}


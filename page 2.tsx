import UpgradeDetails from '@/components/upgrade/upgrade-details';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function UpgradePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Optionally fetch user's current plan to display relevant info
  // const userPlan = await getUserPlan(session.user.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <Link href="/dashboard" className="mb-6 inline-block">
         <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
         </Button>
      </Link>
      <UpgradeDetails />
    </div>
  );
}

// Placeholder for potential future function
// async function getUserPlan(email: string): Promise<string> {
//   // Fetch user plan from DB
//   return 'gratuito'; 
// }


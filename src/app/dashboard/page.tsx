
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return <DashboardClient session={session} />;

}
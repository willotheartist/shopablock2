import 'server-only';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
export async function requirePageUser(){const user=await getSessionUser();if(!user)redirect('/sign-in?next=/app');return user;}

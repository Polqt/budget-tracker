'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

type LoginResult = 
  | { success: true; message: string, redirectTo: string }
  | { success: false; error: string }

export async function login(formData: FormData): Promise<LoginResult> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/login', 'layout')
  return {
    success: true,
    message: 'You have successfully logged in!',
    redirectTo: '/dashboard'
  }
}


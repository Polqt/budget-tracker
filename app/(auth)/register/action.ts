'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

type SignupResult = 
  | { success: true; message: string, redirectTo: string }
  | { success: false; error: string } 

export async function signup(formData: FormData): Promise<SignupResult> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    fullName: formData.get('fullName') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      }
    }
  })

  if (error) {
    return{ success: false, error: error.message}
  }

  // if (data?.user?.identities?.length === 0) {
  //   return { error: 'This email is already registered. Please sign in instead.' }
  // }

  revalidatePath('/register', 'layout')
  return {
    success: true,
    message: 'You have successfully signed up! Please check your email to verify your account.',
    redirectTo: '/login'
  }
}
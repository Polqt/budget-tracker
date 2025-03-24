'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData){
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return {
        success: false,
        message: `Login failed: $(error.message)`
    }
  }

  revalidatePath('/login', 'layout')
  return {
    success: true,
    message: 'Login successful',
    redirectTo: '/dashboard'
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

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
    return {
        success: false,
        message: `Registration failed: $(error.message)`
    }
  }

  // if (data?.user?.identities?.length === 0) {
  //   return { error: 'This email is already registered. Please sign in instead.' }
  // }

  revalidatePath('/register', 'layout')
  return {
    success: true,
    message: 'Account created successfully. Please check your email to verify your account.',
    redirectTo: '/login'
  }
}

export async function logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        redirect('/error')
    }

    redirect('/login')
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(formData.get('email') as string)

    if (error) {
        redirect('/error')
    }

    redirect('/login')
}
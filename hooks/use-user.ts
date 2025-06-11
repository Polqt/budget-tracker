'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Failed to fetch user:', error.message);
        return;
      }

      setUser(user);
    };

    getUser();
  }, []);

  return user;
}

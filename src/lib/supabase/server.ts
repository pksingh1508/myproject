import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

type MutableCookies = {
  get: (name: string) => { value: string } | undefined;
  set: (options: { name: string; value: string } & CookieOptions) => void;
  delete: (options: { name: string } & CookieOptions) => void;
};

interface CreateSupabaseServerClientOptions {
  accessToken?: string | null;
}

export async function createSupabaseServerClient(
  { accessToken }: CreateSupabaseServerClientOptions = {}
) {
  const cookieStore = (await cookies()) as unknown as MutableCookies;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
          }
        : undefined
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete({ name, ...options });
      }
    }
  });
}

export async function createSupabaseServerClientFromAuth() {
  try {
    const authContext = await auth();
    const accessToken = await authContext
      .getToken({ template: "supabase" })
      .catch(() => null);
    return await createSupabaseServerClient({ accessToken });
  } catch (error) {
    console.warn("Unable to resolve Clerk token for Supabase:", error);
    return await createSupabaseServerClient();
  }
}

import { SubmitButton } from '@/components/submit-button';
import { createClient } from '@/service/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/?message=Could not authenticate user');
    }

    return redirect('/woo');
  };

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Login</h1>
      </div>
      <form className="text-foreground flex w-full max-w-96 flex-1 flex-col justify-center gap-2 self-center">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="text-foreground mb-2 rounded-md bg-green-700 px-4 py-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        {/* <SubmitButton
          formAction={signUp}
          className="border-foreground/20 text-foreground mb-2 rounded-md border px-4 py-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton> */}
        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}

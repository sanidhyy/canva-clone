'use client';

import { TriangleAlert } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const SignInCard = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const error = searchParams.get('error');

  const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsPending(true);

    signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    }).then(() => setIsPending(false));
  };

  const onProviderSignIn = (provider: 'github' | 'google') => {
    setIsPending(true);

    signIn(provider, { redirectTo: '/' }).then(() => setIsPending(false));
  };

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>

        <CardDescription>Use your email or another service to continue.</CardDescription>
      </CardHeader>

      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>Invalid Email or Password!</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignIn} className="space-y-2.5">
          <Input disabled={isPending} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required />

          <Input
            disabled={isPending}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <Button disabled={isPending} type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button disabled={isPending} onClick={() => onProviderSignIn('google')} variant="outline" size="lg" className="relative w-full">
            <FcGoogle className="absolute left-2.5 top-2.5 mr-2 size-5" />
            Continue with Google
          </Button>

          <Button disabled={isPending} onClick={() => onProviderSignIn('github')} variant="outline" size="lg" className="relative w-full">
            <FaGithub className="absolute left-2.5 top-2.5 mr-2 size-5" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link prefetch href="/sign-up">
            <span className="text-sky-700 hover:underline">Sign up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

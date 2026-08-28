'use client';

import { TriangleAlert } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useSignUp } from '@/features/auth/hooks/use-sign-up';

export const SignUpCard = () => {
  const { mutate: signUp, isPending, error } = useSignUp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signUp(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          signIn('credentials', {
            email,
            password,
            redirectTo: '/',
          });
        },
      },
    );
  };

  const onProviderSignUp = (provider: 'github' | 'google') => {
    signIn(provider, { redirectTo: '/' });
  };

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create an account</CardTitle>

        <CardDescription>Use your email or another service to continue.</CardDescription>
      </CardHeader>

      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error.message || 'Something went wrong!'}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignUp} className="space-y-2.5">
          <Input disabled={isPending} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />

          <Input disabled={isPending} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required />

          <Input
            disabled={isPending}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={3}
            maxLength={24}
            placeholder="Password"
            required
          />

          <Button disabled={isPending} type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button disabled={isPending} onClick={() => onProviderSignUp('google')} variant="outline" size="lg" className="relative w-full">
            <FcGoogle className="absolute left-2.5 top-2.5 mr-2 size-5" />
            Continue with Google
          </Button>

          <Button disabled={isPending} onClick={() => onProviderSignUp('github')} variant="outline" size="lg" className="relative w-full">
            <FaGithub className="absolute left-2.5 top-2.5 mr-2 size-5" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link prefetch href="/sign-in">
            <span className="text-sky-700 hover:underline">Sign in</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

'use client';

import { EyeIcon, EyeOffIcon, Loader2Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ApiKeysFormValues, apiKeysFormSchema } from '@/features/settings/schemas';

type ApiKeysFormProps = {
  initialValues: ApiKeysFormValues;
};

export const ApiKeysForm = ({ initialValues }: ApiKeysFormProps) => {
  const router = useRouter();
  const [openaiApiKey, setOpenaiApiKey] = useState(initialValues.openaiApiKey ?? '');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const isLoading = isSubmitting || isRemoving;
  const hasSavedKeys = (initialValues.openaiApiKey ?? '').trim().length > 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const parsed = apiKeysFormSchema.safeParse({ openaiApiKey });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid API key.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to save API key.');
      }

      toast.success('API key saved successfully.');
      router.refresh();
    } catch (err: unknown) {
      console.error('[API_KEYS_FORM]: ', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save API key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRemove = async () => {
    try {
      setIsRemoving(true);

      const response = await fetch('/api/settings/api-keys', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove API key.');
      }

      setOpenaiApiKey('');
      setError(null);
      toast.success('API key removed successfully.');
      router.refresh();
    } catch (err: unknown) {
      console.error('[API_KEYS_FORM_REMOVE]: ', err);
      toast.error('Failed to remove API key.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="openaiApiKey">OpenAI API Key</Label>

        <div className="relative">
          <Input
            id="openaiApiKey"
            type={isVisible ? 'text' : 'password'}
            value={openaiApiKey}
            onChange={(e) => {
              setOpenaiApiKey(e.target.value);
              if (error) setError(null);
            }}
            placeholder="sk-proj-•••••••••••••••••••••••••••••••"
            disabled={isLoading}
            autoComplete="off"
            className="pr-10"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => setIsVisible((prev) => !prev)}
            disabled={isLoading}
            aria-label={isVisible ? 'Hide API key' : 'Show API key'}
          >
            {isVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <p className="text-sm text-muted-foreground">
          Get your API Key from{' '}
          <Link
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 opacity-100 hover:opacity-75"
          >
            OpenAI
          </Link>
          . Make sure your account has sufficient{' '}
          <Link
            href="https://platform.openai.com/settings/organization/billing/credit-grants"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 opacity-100 hover:opacity-75"
          >
            credit grants
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {hasSavedKeys && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={isLoading} className="gap-1">
                <Trash2Icon className="size-4" />
                Remove API Key
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove API Key</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove your OpenAI API key? AI image generation will stop working until you add it again.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: 'destructive' })}
                  disabled={isLoading}
                  onClick={() => void onRemove()}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button type="submit" disabled={isLoading} className="gap-1">
          {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
};

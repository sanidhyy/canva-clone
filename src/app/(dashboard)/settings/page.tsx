import { Separator } from '@/components/ui/separator';
import { protectServer } from '@/features/auth/utils';
import { ApiKeysForm } from '@/features/settings/components/api-keys-form';
import { getUserApiKeys } from '@/lib/user-api-keys';

const SettingsPage = async () => {
  await protectServer();

  const apiKeys = await getUserApiKeys();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences and API credentials.</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">API Keys</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide your own OpenAI API key to use AI image generation. Keys are stored encrypted in your browser and expire after 30 days.
          </p>
        </div>

        <ApiKeysForm
          initialValues={{
            openaiApiKey: apiKeys?.openaiApiKey ?? '',
          }}
        />
      </div>
    </div>
  );
};

export default SettingsPage;

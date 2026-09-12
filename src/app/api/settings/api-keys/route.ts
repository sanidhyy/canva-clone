import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { auth } from '@/auth';
import { apiKeysFormSchema } from '@/features/settings/schemas';
import { createOpenAI } from '@/lib/openai';
import { clearUserApiKeys, setUserApiKeys } from '@/lib/user-api-keys';
import { getAISettingsErrorMessage } from '@/lib/utils';

async function validateOpenAIKey(apiKey: string) {
  const openai = createOpenAI(apiKey);

  try {
    await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 1,
    });
  } catch (error) {
    throw new Error(getAISettingsErrorMessage(error));
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = apiKeysFormSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(parsed.error.issues[0]?.message || 'Invalid API key.', { status: 400 });
    }

    const { openaiApiKey } = parsed.data;

    try {
      await validateOpenAIKey(openaiApiKey);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify API key.';
      return new NextResponse(message, { status: 400 });
    }

    await setUserApiKeys({ openaiApiKey });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API_KEYS_POST]: ', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await clearUserApiKeys();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API_KEYS_DELETE]: ', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

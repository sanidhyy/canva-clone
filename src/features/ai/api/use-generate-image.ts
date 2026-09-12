import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<(typeof client.api.ai)['generate-image']['$post']>['json'];
type ResponseType = InferResponseType<(typeof client.api.ai)['generate-image']['$post'], 200>;

export const useGenerateImage = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai['generate-image'].$post({ json });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
            ? body.error
            : response.statusText || 'Failed to generate image.';

        throw new Error(message);
      }

      return await response.json();
    },
  });

  return mutation;
};

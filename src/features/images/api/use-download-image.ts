import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<(typeof client.api.images)['download']['$post']>['json'];
type ResponseType = InferResponseType<(typeof client.api.images)['download']['$post'], 200>;

export const useDownloadImage = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.images.download.$post({ json });

      if (!response.ok) throw new Error(response.statusText ?? 'An unknown error occured.');

      return await response.json();
    },
    onError: (error) => {
      console.error(error.message || 'Failed to download image.');
    },
  });

  return mutation;
};

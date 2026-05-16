import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { ZodError } from 'zod';

import { client } from '@/lib/hono';

type RequestType = InferRequestType<(typeof client.api.users)['$post']>['json'];
type ResponseType = InferResponseType<(typeof client.api.users)['$post']>;

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.users.$post({ json });

      const data = await response.json();

      if (data?.error) throw new Error(data.error instanceof ZodError ? data.error.message : data.error);
      if (!response.ok) throw new Error('An unknown error occured.');

      return data;
    },
  });

  return mutation;
};

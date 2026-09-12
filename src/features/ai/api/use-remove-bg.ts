import { createId } from '@paralleldrive/cuid2';
import { useMutation } from '@tanstack/react-query';

import { uploadFiles } from '@/lib/uploadthing';

type RequestType = {
  image: string;
};

type ResponseType = {
  data: string;
};

export const useRemoveBg = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ image }) => {
      const { removeBackground } = await import('@imgly/background-removal');

      const blob = await removeBackground(image);
      const file = new File([blob], `${createId()}.png`, { type: 'image/png' });

      const [uploaded] = await uploadFiles('imageUploader', {
        files: [file],
      });

      if (!uploaded?.ufsUrl) throw new Error('Failed to upload background-removed image');

      return { data: uploaded.ufsUrl };
    },
  });

  return mutation;
};

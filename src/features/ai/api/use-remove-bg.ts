import { useMutation } from '@tanstack/react-query';

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
      const url = URL.createObjectURL(blob);

      return { data: url };
    },
  });

  return mutation;
};

import { useMutation, useQueryClient } from "react-query";

const useImageUpload = () => {
  const queryClient = useQueryClient();

  const uploadImage = async (file: FormData) => {
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/talk-addictive/image/upload",
        {
          method: "POST",
          body: file,
        }
      );

      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return error;
    }
  };

  const { mutate, isLoading, error, data } = useMutation(uploadImage, {
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries("images");
    },
  });

  const handleUpload = (file: FormData) => {
    mutate(file);
  };

  return {
    handleUpload,
    isLoading,
    error,
    data,
  };
};

export default useImageUpload;

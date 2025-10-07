import { useMutation, useQueryClient } from "react-query";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";
export interface AddCategoryFields {
  categoryTitle: string;
  categoryDescription: string;
}

export function useAddCategory() {
  const baseUrl = useCafeBaseUrl();

  function buildApiEndpoint() {
    const url = baseUrl + "/category/add";
    return url;
  }

  const addCategory = async (formData: AddCategoryFields) => {
    const url = buildApiEndpoint();
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return response.json();
  };

  const queryClient = useQueryClient();

  const addCategoryMutation = useMutation(addCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categoryData");
    },
  });

  return {
    addCategory: addCategoryMutation.mutateAsync,
    isLoading: addCategoryMutation.isLoading,
    error: addCategoryMutation.error,
  };
}

import { useMutation, useQueryClient } from "react-query";
import { UpdateCategory } from "../../modal/add-category-modal";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useUpdateCategory() {
  const baseUrl = useCafeBaseUrl();
  function buildApiEndpoint(categoryId: string) {
    const url = baseUrl + `/category/update?categoryId=${categoryId}`;
    return url;
  }

  const updateCategory = async (formData: UpdateCategory) => {
    const url = buildApiEndpoint(formData.categoryId);
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "PATCH",
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

  const addCategoryMutation = useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categoryData");
    },
  });

  return {
    updateCategory: addCategoryMutation.mutateAsync,
    isLoading: addCategoryMutation.isLoading,
    error: addCategoryMutation.error,
  };
}

import { useMutation, useQueryClient } from "react-query";

function buildApiEndpoint(categoryId?:string) {
  let url = `http://localhost:8080/category/delete`;
  if(categoryId){
    url += `?categoryId=${categoryId}`;
  }
  return url;
}

const deleteCategory = async (categoryId:string) => {
  const url = buildApiEndpoint(categoryId);
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong!!");
  }

  return response.json();
};

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("deleteCategory");
    },
  });

  return {
    deleteCategory: async (categoryId:string) => {
      try {
        return await deleteMutation.mutateAsync(categoryId);
      } catch (error) {
        return error;
      }
    },
    isLoading: deleteMutation.isLoading,
    error: deleteMutation.error,
  };
}

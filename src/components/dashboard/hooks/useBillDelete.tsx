import { useMutation, useQueryClient } from "react-query";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useBillDelete() {
  const baseUrl = useCafeBaseUrl();
  function buildApiEndpoint(billId?: string) {
    let url = baseUrl + `/bill/delete`;
    if (billId) {
      url += `/${billId}`;
    }
    return url;
  }

  const deleteBill = async (billId: string) => {
    const url = buildApiEndpoint(billId);
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

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(deleteBill, {
    onSuccess: () => {
      queryClient.invalidateQueries("deleteBill");
    },
  });

  return {
    deleteBill: async (billId: string) => {
      try {
        return await deleteMutation.mutateAsync(billId);
      } catch (error) {
         return error;
      }
    },
    isLoading: deleteMutation.isLoading,
    error: deleteMutation.error,
  };
}

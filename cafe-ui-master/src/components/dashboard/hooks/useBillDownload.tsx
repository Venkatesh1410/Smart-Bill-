import { useMutation, useQueryClient } from "react-query";
import { Bill } from "../components/bill/bill";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useBillDownload() {
  const baseUrl = useCafeBaseUrl();

  function buildApiEndpoint() {
    const url = baseUrl + `/bill`;
    return url;
  }

  const downloadBill = async (bill: Bill) => {
    let url = buildApiEndpoint();
    url += `/generateReport`;
    
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bill),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong!!");
    }

    return response.json();
  };

  const queryClient = useQueryClient();

  const downloadMutation = useMutation(downloadBill, {
    onSuccess: () => {
      queryClient.invalidateQueries("downloadBill");
    },
  });

  return {
    downloadBill: async (bill: Bill) => {
      try {
        return await downloadMutation.mutateAsync(bill);
      } catch (error) {
        return error;
      }
    },
    isLoading: downloadMutation.isLoading,
    error: downloadMutation.error,
  };
}

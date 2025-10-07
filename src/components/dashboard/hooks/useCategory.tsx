import { useQuery } from "react-query";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useCategory() {
  const baseUrl = useCafeBaseUrl();
  const buildApiEndpoint = () => {
    const url = baseUrl + "/category/get";
    return url;
  };

  const getCategories = async () => {
    const token = localStorage.getItem("token");
    const url = buildApiEndpoint();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: "categoryData",
    queryFn: async () => await getCategories(),
  });

  return {
    categories: data,
    isLoading,
    error,
    refetch,
  };
}

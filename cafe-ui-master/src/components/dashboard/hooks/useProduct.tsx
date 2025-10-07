import { useQuery } from "react-query";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useProduct() {
  
  const baseUrl = useCafeBaseUrl();
  const buildApiEndpoint = () => {
    const url = baseUrl + "/product/get";
    return url;
  };
  
  const getProducts = async () => {
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

  const { data, isLoading, error,refetch } = useQuery({
    queryKey: "productData",
    queryFn: async () => await  getProducts(),
  });

  return {
    products: data,
    isLoading,
    error,
    refetch,
  };
}

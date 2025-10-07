import { useQuery } from "react-query";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useDashboard() {
  const baseUrl = useCafeBaseUrl();
  const buildApiEndpoint = () => {
    const url = baseUrl + "/dashboard/details";
    return url;
  };

  const getDetails = async () => {
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

  const { data, isLoading, error } = useQuery({
    queryKey: "dashboardData",
    queryFn: async () => await getDetails(),
  });

  return {
    details: data,
    isLoading,
    error,
  };
}

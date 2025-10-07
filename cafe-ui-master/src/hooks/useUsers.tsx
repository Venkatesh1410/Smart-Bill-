import { useQuery } from "react-query";
import { useCafeBaseUrl } from "../shared/hooks/useCafeBaseUrl";

export function useUsers() {
  const baseUrl = useCafeBaseUrl();
  const buildApiEndpoint = () => {
    const url = baseUrl + "/user/get";
    return url;
  };

  const getUsers = async () => {
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
    queryKey: "userData",
    queryFn: async () => await getUsers(),
  });

  return {
    users: data,
    isLoading,
    error,
  };
}

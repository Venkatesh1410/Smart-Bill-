import { useMutation, useQueryClient } from "react-query";
import { useCafeBaseUrl } from "../shared/hooks/useCafeBaseUrl";

interface FormFields {
  userName?: string;
  userEmail?: string;
  password?: string;
  userPhoneNo?: string;
}

export function useLogin() {
  const baseUrl = useCafeBaseUrl();

  function buildApiEndpoint() {
    const url = baseUrl + "/user/login";
    return url;
  }

  const loginUser = async (formData: FormFields) => {
    const url = buildApiEndpoint();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login Failed");
    }

    return response.json();
  };

  const queryClient = useQueryClient();

  const loginMutation = useMutation(loginUser, {
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      queryClient.invalidateQueries("user");
    },
  });

  return {
    loginUser: async (formData: FormFields) => {
      try {
        return await loginMutation.mutateAsync(formData);
      } catch (error) {
        return error;
      }
    },
    isLoading: loginMutation.isLoading,
    error: loginMutation.error,
  };
}

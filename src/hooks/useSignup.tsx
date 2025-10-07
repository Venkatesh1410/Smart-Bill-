import { useMutation } from "react-query";
import { useCafeBaseUrl } from "../shared/hooks/useCafeBaseUrl";
interface FormFields {
  userName?: string;
  userEmail?: string;
  password?: string;
  userPhoneNo?: string;
}

export function useSignUp() {
  const baseUrl = useCafeBaseUrl();

  function buildApiEndpoint() {
    const url = baseUrl + "/user/signup";
    return url;
  }

  const registerUser = async (formData: FormFields) => {
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
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  };
  const registerMutation = useMutation(registerUser);

  return {
    registerUser: registerMutation.mutateAsync,
    isLoading: registerMutation.isLoading,
    error: registerMutation.error,
  };
}

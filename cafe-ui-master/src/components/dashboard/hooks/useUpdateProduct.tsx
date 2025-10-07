import { useMutation, useQueryClient } from "react-query";
import { UpdateProduct } from "../../modal/add-product-modal";
import { useCafeBaseUrl } from "../../../shared/hooks/useCafeBaseUrl";

export function useUpdateProduct() {
  const baseUrl = useCafeBaseUrl();
  function buildApiEndpoint(productId?: string) {
    let url = baseUrl + `/product/update`;
    if (productId) {
      url += `?productId=${productId}`;
    }
    return url;
  }

  const updateProduct = async (formData: UpdateProduct) => {
    const url = buildApiEndpoint(formData.productId);
    const token = localStorage.getItem("token");
    const formPayload = {
      productName: formData?.productName,
      productDescription: formData?.productDescription,
      productPic: formData?.productPic,
      productPrice: formData?.productPrice,
      productQuantity: formData?.productQuantity,
      category: formData?.category,
      status: formData?.status,
    };
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return response.json();
  };

  const queryClient = useQueryClient();

  const updateProductMutation = useMutation(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("productData");
    },
  });

  return {
    updateProduct: updateProductMutation.mutateAsync,
    isLoading: updateProductMutation.isLoading,
    error: updateProductMutation.error,
  };
}

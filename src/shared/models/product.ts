import { Category } from "./category";

export interface ProductProps {
    productId: number;
    productName: string;
    productDescription: string;
    productPic: string;
    productPrice: string;
    productAvailability: boolean;
    status: string;
    category: Category;
}

export interface UpdateProduct {
  productId?: string;
  productName?: string;
  productDescription?: string;
  productPic?: string;
  productAvailability?: string;
  productPrice?: string;
  productQuantity?: string;
  status?: string;
  categoryName?: string;
  category?:string;
  categoryId?: string;
}
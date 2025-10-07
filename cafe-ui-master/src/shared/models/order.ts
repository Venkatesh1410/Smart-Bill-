export interface DropDown {
  label: string;
  value: string;
  id?: string;
}
export interface Order {
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  paymentMethod: string;
  totalAmount: string;
  productDetails: string;
  isGenerated: string;
  categoryName?:string;
  productName?:string;
  productPrice?:string;
  productQuantity?:string;
}


export interface TableProduct {
  id: number;
  name:string;
  category:string;
  quantity?:string;
  price?:number;
  total:number;
}
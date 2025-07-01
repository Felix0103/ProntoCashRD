import { Product, ProductAvailable } from "./product";

export interface Invoice {
    id?: number
    invoice_date: string;
    invoice_number: number;
    ware_house_id: number;
    user_id: number;
    customer_id: number;
    active: number;
    invoice_details: InvoiceDetail[];
    invoice_payment_methods: InvoicePaymentMethod[];
  }

  export interface InvoiceDetail {
    id?: number
    invoice_id: number;
    product_id: number;
    quantity: number;
    cost_amount: number;
    price_amount: number;
    active: number;
    product: Product | ProductAvailable;
  }

export interface Customer{
  id: number;
  customer_name: string;
  credit_limit: number;
}

export interface InvoicePaymentMethod{
  id: number;
  invoice_id: number;
  payment_method_id: number;
  amount: number;
  payment_method: PaymentMethod;
}

export interface PaymentMethod{
  id: number;
  name: string;
  active: number;
}
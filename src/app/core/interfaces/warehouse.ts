import { Product, ProductAvailable } from "./product";

export interface Warehouse{
    id: number,
    warehouse_name: string;
    active: number;
}

export interface MerchandiseEntry{
    id: number;
    doc_date: string;
    ware_house_id: number;
    comments: string;
    active: number;
    merchandise_entry_details: MerchandiseEntryDetail[]
}
export interface MerchandiseEntryDetail{
    id: number;
    merchandise_entry_id: number;
    quantity: number;
    product_id: number;
    cost_amount: number;
    active: number;
    product: Product
}

export interface MerchandiseTransfer{
    id: number;
    doc_date: string;
    ware_house_id_source: number;
    ware_house_id_destination: number;
    comments: string;
    active: number;
    merchandise_transfer_details: MerchandiseTransferDetail[]
}

export interface MerchandiseTransferDetail{
    id: number;
    merchandise_transfer_id: number;
    product_id: number;
    quantity: number;
    active: number;
    product: Product | ProductAvailable
}


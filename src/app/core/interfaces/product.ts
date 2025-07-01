export interface Product{
    id: number,
    product_category_id: number;
    name: string;
    description: string;
    bar_code: string;
    stock_minimum: number;
    url_image: string;
    active: number;
    last_price: LastPrice,
    product_prices?: LastPrice[];
    available?: number;
    price?: number;
}

export interface LastPrice{
    id: number,
    product_id: number;
    effective_date: string;
    price: number;
}

export interface ProductAvailable{
    id: number,
    name: string;
    available: number;
    price?: number;
}
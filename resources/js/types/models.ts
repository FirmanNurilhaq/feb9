export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Product {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    variant_color?: string;
    variant_size?: string;
    unit: string;
    cost_price: number;
    selling_price: number;
    min_stock: number;
    current_stock: number;
    is_low_stock?: boolean;
    image_path?: string;
    description?: string;
    is_active: boolean;
    category?: Category;
    created_at?: string;
}

export interface StockMovement {
    id: number;
    product_id: number;
    type: 'inbound' | 'outbound_manual' | 'sales' | 'return_restock' | 'return_discard' | 'opname_adjustment';
    quantity: number;
    balance_before: number;
    balance_after: number;
    reference_type?: string;
    reference_id?: number;
    notes?: string;
    product_name?: string;
    sku?: string;
    created_at?: string;
}

export interface InboundItem {
    id: number;
    inbound_shipment_id: number;
    product_id: number;
    quantity: number;
    purchase_price: number;
    subtotal: number;
    product?: Product;
}

export interface InboundShipment {
    id: number;
    shipment_number: string;
    supplier_name?: string;
    inbound_date: string;
    notes?: string;
    items?: InboundItem[];
    created_at?: string;
}

export interface SalesItem {
    id: number;
    sales_transaction_id: number;
    product_id: number;
    quantity: number;
    cost_price: number;
    selling_price: number;
    subtotal_amount: number;
    subtotal_profit: number;
    was_forced: boolean;
    product?: Product;
}

export interface SalesTransaction {
    id: number;
    invoice_number: string;
    buyer_name: string;
    transaction_date: string;
    total_amount: number;
    total_cogs: number;
    total_profit: number;
    has_override: boolean;
    notes?: string;
    items?: SalesItem[];
    created_at?: string;
}

export interface ReturnRecord {
    id: number;
    return_number: string;
    sales_transaction_id?: number;
    product_id: number;
    quantity: number;
    disposition: 'restock' | 'discard';
    reason: string;
    notes?: string;
    return_date: string;
    product?: Product;
    transaction?: SalesTransaction;
    created_at?: string;
}

export interface StockOpnameItem {
    id: number;
    stock_opname_id: number;
    product_id: number;
    system_stock: number;
    physical_stock: number;
    difference: number;
    reason?: string;
    notes?: string;
    product?: Product;
}

export interface StockOpname {
    id: number;
    opname_number: string;
    opname_date: string;
    status: string;
    notes?: string;
    items?: StockOpnameItem[];
    created_at?: string;
}

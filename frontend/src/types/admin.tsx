export interface RevenueByDay {
  date: string;
  revenue: number;
  orders_count: number;
}

export interface StockSummary {
  total_products: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

export interface LowStockProduct {
  product_id: number;
  name: string;
  stock: number;
  category?: string | null;
}

export interface DailyOrder {
  id: number;
  user: { name: string } | null;
  total_price: number;
  status: string;
  created_at: string;
  items_count: number;
}

export interface AttributeValue {
  id: number;
  value: string;
  hex_code?: string | null;
  type?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface AttributeType {
  id: number;
  name: string;
  slug: string;
  values: AttributeValue[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  image_path:string,
  stock: number;
  price_override?: number | null;
  attribute_values: AttributeValue[];
}

export interface Species {
  id: number;
  name: string;
  slug: string;
}


export type OrderStatus = "pending" | "shipped" | "delivered" | "paid" | "cancelled";

export interface OrderItemDetail {
  id: number;
  product_id: number;
  quantity: number;
  image:string;
  value:string | null;
  price: number;
  total: number;
  product?: { id: number; name: string,image:string } | null;
}

export interface OrderDetail {
  id: number;
  user_id: number | null;
  user: { id: number; name: string; email?: string, image?: string | null } | null;
  total_price: number;
  points_used: number | null;
  status: OrderStatus;
  shipping: number;
  phone: string;
  city: string;
  address: string;
  embalage: string | null;
  name:string;
  items: OrderItemDetail[];
  created_at: string;
  updated_at: string;
}

export interface OrdersMeta {
  current_page: number;
  last_page: number;
  total: number;
}



export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: number;
  nom_chat: string;
  race: string;
  age_mois: number;
  telephone: string;
  date_arrivee: string;   
  date_sortie: string;    
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}

// Laravel's paginate() shape, returned as response.data.data
export interface ReservationsPaginated {
  current_page: number;
  data: Reservation[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetReservationsParams {
  search?: string;
  status?: ReservationStatus | "";
  sort?: "date_arrivee" | "date_sortie" | "created_at" | "nom_chat" | "age_mois";
  dir?: "asc" | "desc";
  per_page?: number;
  page?: number;
}
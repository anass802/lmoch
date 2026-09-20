import type { MoroccoCity } from "../data/moroccoCities";
import type { ProductVariant, AttributeValue } from "../types/admin"; 

export interface Product {
    id: number;
    name: string;
    category?: { name: string }
    slug: string;
    description?: string;
    last_page?: number;
    price: number;
    old_price?: number;
    reduction_percent?: number;
    image?: string;
    category_id?: number;
    species_id?: number;
    is_promo: boolean;
    is_best: boolean;
    stock: number;
    created_at: string;
    updated_at: string;
    variants?: ProductVariant[];

}

export interface Categories {
    id: number;
    name: string;
    slug: string;
}

export interface Species {
    id: number;
    name: string;
    slug: string;
    categories: Categories[];
}
export interface Client {
    name: string,
    email: string,
    phone: string,
    points_balance: number
}
type EmballageType = ''|'gratuit' | 'standard' | 'premium';
export interface InfoClientState {
    name?: string;
    phone: string;
    city: MoroccoCity | "";
    address: string;
    paid_by: "money" | "points",
    points_used: number,
    emballage: EmballageType;
}
export interface CartItem {
    id: number;
    quantity: number;
}
export interface InfoCheckout {
    user_id: number;
    name?: string;
    phone: string;
    city: MoroccoCity | "";
    address: string;
    paid_by: 'money' | 'points';
    points_used?: number;
    items: CartItem[];
}
export interface CheckoutResponse {
    success: boolean;
    message: string;
    points_balance?: number;
}
export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface ReservationPayload {
  nom_chat: string;
  race: string;
  age_mois: number;
  telephone: string;
  date_arrivee: string;   
  date_sortie: string; 
  sterilise:boolean,   
  notes?: string;
}

export interface ReservationRecord {
  id: number;
  nom_chat: string;
  race: string;
  age_mois: number;
  telephone: string;
  date_arrivee: string;
  date_sortie: string;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface ReservationResponse {
  data: ReservationRecord;
}
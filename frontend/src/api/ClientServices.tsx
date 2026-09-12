import api from "./api";
import type { Product,Species,Categories,InfoCheckout,CheckoutResponse,ReservationPayload, ReservationResponse } from "../types/Clients";
import type { CatListing } from "../types/Cats";

interface FilterParams {
  category_id: number;
  species_id: number;
  page:number
}
interface SuggestionParams {
  category_id: number;
  species_id: number;
  product_id:number
  
}

// ----Home Page---- //
export const getTopCustomers = () => api.get("/top-customers");
export const getChatJouets=()=>api.get<{data:Product[]}>('chat-jouets')
export const getChienJouets=()=>api.get<{data:Product[]}>('chien-jouets')
export const getRandomProducts=()=>api.get<{data:Product[]}>('random-products')
export const getSearch=(q:string)=>api.get<{data:Product[]}>('search',{
    params: { q }
  })
export const getActiveEvent = () => api.get("/active-event");
export const getPromoProducts = () => api.get<{data:Product[]}>("/promo-products");

// ----Category Products Page---//
export const getSpecies=()=>api.get<{data:Species[]}>('get-species')
export const getCategories=(slug:string)=>api.get<{data:Categories[]}>(`species/${slug}/categories`)
export const getFilteredProducts = ({ category_id, species_id,page = 1 }: FilterParams) =>
  api.get<{ data: Product[] }>(
    `get-filtred-product/${category_id}/${species_id}?page=${page}`
  );

// ----View Product Details Page----- //
export const getProduct=(slug:string)=>api.get<{data:Product}>(`get-product-details/${slug}`)
export const getSuggestionProducts=({product_id,species_id,category_id}:SuggestionParams)=>
  api.get<{data:Product[]}>(
    `suggestion-products/${product_id}/${species_id}/${category_id}`
  )
// ----View Animal Details Page----- //
export const getAnimal=(id:number)=>api.get<{data:CatListing}>(`get-animal-details/${id}`)
// -----Checkout------ //

export const checkout = (data: InfoCheckout) =>
  api.post<CheckoutResponse>("/checkout", data);


export const createReservation = (data: ReservationPayload) =>
  api.post<ReservationResponse>("/reservations", data);

//--- NewsletterSubscriber ---//
export const NewsletterSubscriber=(email:string)=>
  api.post<{message:string}>('create-subscriber',{email})
import type {
  RevenueByDay, StockSummary, LowStockProduct, DailyOrder, AttributeType, ProductVariant,OrderDetail,OrdersMeta,OrderStatus
} from "../types/admin";
import type { Product, Species, Category } from "../types/Clients";
import api from "./api";

// ---- Products ----
export const getProducts = (page = 1) =>
  api.get<{ data: Product[] }>(`/get-all-products?page=${page}`); 

export const deleteProduct = (id: number) =>
  api.delete<{message:string,success:boolean}>(`/products/${id}`);

export const createProduct = (formData: FormData) =>
  api.post<{ data: Product }>(`/products`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id: number, formData: FormData) => {
  formData.append("_method", "PUT");
  return api.post<{ data: Product }>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getCategories = () =>
  api.get<{ data: Category[] }>(`/get-species`.replace("species", "categories")); // placeholder, see note below

// ---- Stats ----
export const getRevenueByDay = (days = 30) =>
  api.get<{ data: RevenueByDay[] }>(`/stats/revenue-by-day`, { params: { days } });

export const getStockSummary = () =>
  api.get<{ data: StockSummary }>(`/stats/stock-summary`);

export const getLowStockProducts = (limit = 10) =>
  api.get<{ data: LowStockProduct[] }>(`/stats/low-stock`, { params: { limit } });

export const getOrdersByDay = (date: string, limit = 10) =>
  api.get<{ data: DailyOrder[] }>(`/orders/by-day`, { params: { date, limit } });

// ---- Variants / categories ----
export const getCategoryAttributeTypes = (categoryId: number) =>
  api.get<{ data: AttributeType[] }>(`/categories/${categoryId}/attribute-types`);

export const getUncategorizedProducts = (page=1) =>
  api.get<{ data: Product[] }>(`/products/uncategorized?page=${page}`);

export const updateProductCategory = (productId: number, payload: { category_id: number; species_id: number }) =>
  api.patch(`/products/${productId}/category`, payload);

export const getProductVariants = (productId: number) =>
  api.get<{ data: ProductVariant[] }>(`/products/${productId}/variants`);

export const saveProductVariants = (
  productId: number,
  payload: { combinations: number[][] } | FormData
) =>
  api.post(`/products/${productId}/variants`, payload, {
    headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

export const getSpecies = () =>
  api.get<{ data: Species[] }>(`/get-species`);



export const getOrders = (params: {
  status?: string; date_from?: string; date_to?: string; page?: number; per_page?: number;
}) => api.get<{ data: OrderDetail[]; meta: OrdersMeta }>(`/orders`, { params });

export const updateOrderStatus = (orderId: number, status: OrderStatus) =>
  api.patch<{ data: OrderDetail }>(`/orders/${orderId}/status`, { status });


export const getCatListingsAdmin = (page = 1, params: Record<string, any> = {}) =>
  api.get("/admin/cat-listings", { params: { page, ...params } });

export const getCatListingAdmin = (id: number) => api.get(`/admin/cat-listings/${id}`);

export const createCatListing = (payload: FormData) =>
  api.post("/admin/cat-listings", payload, { headers: { "Content-Type": "multipart/form-data" } });

export const updateCatListing = (id: number, payload: FormData) => {
  payload.append("_method", "PUT"); // Laravel form-data spoofing for PUT
  return api.post(`/admin/cat-listings/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
};

export const deleteCatListing = (id: number) => api.delete(`/admin/cat-listings/${id}`);
export const getAdminEvents=()=>api.get('/admin/events');
export const activateEvent=(id:number)=>api.post(`admin/events/${id}/activate`);
export const deactivateAllEvents=()=>api.post('/admin/events/deactivate')
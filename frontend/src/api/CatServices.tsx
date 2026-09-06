import api from "./api";
import type { CatFilters } from "../types/Cats";

export const getCatListings = (filters: Partial<CatFilters>, page = 1) => {
  const params: Record<string, string | number | boolean> = { page };
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== "" && value !== false) params[key] = value as any;
  });
  return api.get("/cat-listings", { params });
};

export const getCatBreeds = (listingType?: string) =>
  api.get("/cat-listings/breeds", { params: listingType ? { listing_type: listingType } : {} });

export const getCatListing = (id: number) => api.get(`/cat-listings/${id}`);
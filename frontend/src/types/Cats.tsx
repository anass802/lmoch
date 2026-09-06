export type ListingType = "vente" | "adoption";
export type Gender = "male" | "female";

export type CatListing = {
  id: number;
  name: string;
  breed: string | null;
  age_months: number | null;
  gender: Gender;
  color: string | null;
  description: string | null;
  listing_type: ListingType;
  price: number | null;
  city: string | null;
  vaccinated: boolean;
  sterilized: boolean;
  image: string | null;
  status: string;
  owner_name: string | null;
  owner_phone: string | null;
};

export type CatFilters = {
  listing_type: ListingType | null;
  gender: Gender | "" ;
  breed: string;
  city: string;
  min_age: string;
  max_age: string;
  vaccinated: boolean;
  sterilized: boolean;
  min_price: string;
  max_price: string;
  search: string;
};

export const emptyFilters: CatFilters = {
  listing_type: null,
  gender: "",
  breed: "",
  city: "",
  min_age: "",
  max_age: "",
  vaccinated: false,
  sterilized: false,
  min_price: "",
  max_price: "",
  search: "",
};
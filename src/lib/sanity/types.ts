import type { PortableTextBlock } from "@portabletext/react";

export type Settings = {
  whatsappNumber: string;
  instagramUrl: string | null;
  tagline: string | null;
  contactInfo: string | null;
};

export type ProductGender = "masculino" | "femenino" | "unisex";

export type ProductImage = {
  _key: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
};

export type ProductBrand = {
  name: string;
  slug: { current: string };
};

export type ProductCategory = {
  name: string;
  slug: { current: string };
};

export type ProductSummary = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  available: boolean;
  featured: boolean;
  usedInVideo: boolean;
  gender: ProductGender;
  sizeMl: number | null;
  concentration: string | null;
  brand: ProductBrand;
  images: ProductImage[];
};

export type BrandLogo = {
  asset: {
    _ref: string;
    _type: "reference";
  };
};

export type BrandDetail = {
  _id: string;
  name: string;
  slug: { current: string };
  description: string | null;
  origin: string | null;
  logo: BrandLogo | null;
  products: ProductSummary[];
};

export type BrandSummary = {
  _id: string;
  name: string;
  slug: { current: string };
  description: string | null;
  logo: BrandLogo | null;
};

export type PageDetail = {
  _id: string;
  title: string;
  slug: { current: string };
  body: PortableTextBlock[];
};

export type ProductDetail = {
  _id: string;
  name: string;
  slug: { current: string };
  brand: ProductBrand;
  category: ProductCategory;
  gender: ProductGender;
  price: number;
  available: boolean;
  visible: boolean;
  featured: boolean;
  usedInVideo: boolean;
  videoUrl: string | null;
  sizeMl: number | null;
  concentration: string | null;
  description: string | null;
  topNotes: string | null;
  heartNotes: string | null;
  baseNotes: string | null;
  images: ProductImage[];
};

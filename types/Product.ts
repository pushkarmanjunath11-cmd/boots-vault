export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
  sizes?: Record<string, number>;
  featured?: boolean;
};

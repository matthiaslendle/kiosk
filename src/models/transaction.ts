import { Article } from './article';

export interface Transaction {
  id: number;
  cart: CartItem[];
  deposit: number;
  time: number;
}

export interface CartItem {
  article: Article;
  quantity: number;
}

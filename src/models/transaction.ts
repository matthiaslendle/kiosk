import { Article } from './article';

export interface Transaction {
  id: number;
  cart: CartItem[];
  deposit: number;
  time: Date;
}

export interface CartItem {
  article: Article;
  quantity: number;
}

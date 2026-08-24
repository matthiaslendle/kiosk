import { CartItem } from './CartItem';

export interface Transaction {
  id: string;
  cart: CartItem[];
  deposit: number;
  time: Date;
}

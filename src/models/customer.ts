import { Transaction } from './transaction';

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  details: string;
  group: string;
  transactions: Transaction[];
}

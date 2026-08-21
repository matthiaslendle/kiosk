import { Transaction } from './Transaction';

export interface Customer {
  id: number;
  lastname: string;
  firstname: string;
  details: string;
  group: string;
  transactions: Transaction[];
}

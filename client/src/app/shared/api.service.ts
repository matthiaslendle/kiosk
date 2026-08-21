import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Article } from '../models/Article';
import { CartItem } from '../models/CartItem';
import { Customer } from '../models/Customer';
import { Transaction } from '../models/Transaction';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private readonly apiUrl = 'http://localhost:9000/api';

  getAllCustomers() {
    return this.http.get<Customer[]>(this.apiUrl + '/customer');
  }

  getCustomer(id: string) {
    return this.http.get<Customer>(this.apiUrl + '/customer/' + id);
  }

  addCustomer(firstname: string, lastname: string, group: string, details: string, credit: number) {
    return this.http.post<Customer>(
      this.apiUrl + '/customer',
      { firstname, lastname, group, details, credit },
      { headers: this.headers }
    );
  }

  updateCustomer(customer: Omit<Customer, 'transactions'>) {
    return this.http.patch<Customer>(
      this.apiUrl + '/customer/' + customer.id,
      { firstname: customer.firstname, lastname: customer.lastname, details: customer.details, group: customer.group },
      { headers: this.headers }
    );
  }

  addArticle(name: string, category: string, price: number) {
    return this.http.post<Article>(
      this.apiUrl + '/article',
      { name, price, category },
      { headers: this.headers }
    );
  }

  getAllArticles() {
    return this.http.get<Article[]>(this.apiUrl + '/article');
  }

  updateArticle(id: string, name: string, category: string) {
    return this.http.patch<Article>(
      this.apiUrl + '/article/' + id,
      { name, category },
      { headers: this.headers, }
    );
  }

  toggleArticle(id: string, disabled: boolean) {
    const response = this.http.post<Article>(
      this.apiUrl + '/article/toggle/' + id,
      { disabled },
      { headers: this.headers }
    );
    return response
  }

  getAllTransactions() {
    return this.http.get<Transaction[]>(this.apiUrl + '/action');
  }

  addTransaction(customerId: string, cart: CartItem[], deposit = 0) {
    return this.http.post<Transaction>(
      this.apiUrl + '/action',
      {
        customerId,
        cart,
        deposit,
        time: Date.now(),
      },
      { headers: this.headers }
    );
  }

  export() {
    return this.http.get<{ success: boolean }>(this.apiUrl + '/excel/export')
  }

  import() {
    return this.http.get<{ imported: { customers: number; articles: number } }>(
      this.apiUrl + '/excel/import'
    )
  }
}

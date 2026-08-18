import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:9000/api';

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl + '/customer');
  }

  getCustomer(id): Observable<Customer> {
    return this.http.get<Customer>(this.apiUrl + '/customer/' + id);
  }

  addCustomer(firstname, lastname, group, details, credit): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiUrl + '/customer',
      { firstname, lastname, group, details, credit },
      { headers: this.headers }
    );
  }

  updateCustomer(id, firstname, lastname, details, group) {
    return this.http.patch<Customer>(
      this.apiUrl + '/customer/' + id,
      { firstname, lastname, details, group },
      { headers: this.headers }
    )
  }

  addArticle(name, category, price): Observable<Article> {
    return this.http.post<Article>(
      this.apiUrl + '/article',
      { name, price, category },
      { headers: this.headers }
    );
  }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl + '/article');
  }

  updateArticle(id, name, category): Observable<Article> {
    return this.http.patch<Article>(this.apiUrl + '/article/' + id, { name, category }, {
      headers: this.headers,
    });
  }

  toggleArticle(id: string, disabled: boolean): Observable<Article> {

    const response = this.http.post<Article>(this.apiUrl + '/article/disable/', { id, disabled }, { headers: this.headers })
    return response
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl + '/action');
  }

  addTransaction(
    customerId: string,
    cart: CartItem[],
    deposit = 0
  ): Observable<Transaction> {
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

  export(): Observable<void> {
    return this.http.get<void>(this.apiUrl + '/excel/export')
  }

  import(): Observable<{ imported: { customers: number; articles: number } }> {
    return this.http.get<{ imported: { customers: number; articles: number } }>(
      this.apiUrl + '/excel/import'
    )
  }
}

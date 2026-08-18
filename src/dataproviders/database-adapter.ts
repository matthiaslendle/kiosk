import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

import { Article } from '../models/article';
import { Customer } from '../models/customer';
import { CartItem, Transaction } from '../models/transaction';

export class DatabaseAdapter {
  private db: JsonDB;
  constructor() {
    this.db = new JsonDB(new Config('kiosk.json', true, true));
  }

  // Articles
  getArticles(): Article[] {
    return this.getOrElse('/articles', []);
  }

  addArticle(article: Article): Article {
    const id = this.getOrElse('/nextArticleID', 0);
    article.id = id;
    article.disabled = article.disabled || false;
    this.db.push('/articles[]', article, true);
    this.db.push('/nextArticleID', id + 1);
    return article;
  }

  getArticleByID(id: number): Article {
    return this.getArticles().filter(a => a.id === id)[0];
  }

  disableArticle(id: number, disabled: boolean): Article {
    const article = this.getArticleByID(id);
    article.disabled = disabled;
    const index = this.db.getIndex('/articles', article.id);
    this.db.push(`/articles[${index}]`, article, true);
    return article;
  }

  updateArticle(id: number, name: string, category: string): Article {
    const article = this.getArticleByID(id);
    article.name = name;
    article.category = category;
    const index = this.db.getIndex('/articles', article.id);
    this.db.push(`/articles[${index}]`, article, true);
    return article;
  }

  // Customers

  getCustomers(): Customer[] {
    return this.getOrElse('/customers', []);
  }

  addCustomer(customer: Customer): Customer {
    const id = this.getOrElse('/nextCustomerID', 0);
    customer.id = id;
    customer.transactions = [];
    this.db.push('/customers[]', customer, true);
    this.db.push('/nextCustomerID', id + 1);
    return customer;
  }

  getCustomerByID(id: number): Customer {
    return this.getCustomers().filter(c => c.id === id)[0];
  }

  updateCustomer(id: number, firstname: string, lastname: string, group: string, details: string): Customer {
    const customer = this.getCustomerByID(id);
    customer.firstname = firstname;
    customer.lastname = lastname;
    customer.details = details;
    customer.group = group;

    const index = this.db.getIndex('/customers', id);
    this.db.push(`/customers[${index}]`, customer, true);
    return customer;
  }

  // Transactions
  getTransactions(): Transaction[] {
    return this.getCustomers().flatMap(c => c.transactions);
  }

  addTransaction(customerId: number, cart: CartItem[], deposit: number, time: Date): Transaction {
    const id = this.getOrElse('/nextTransactionID', 0);
    const action: Transaction = { id, cart, deposit, time };

    const customers = this.getCustomers();
    const customer = customers.filter(c => c.id === customerId)[0];
    const index = customers.indexOf(customer);
    this.db.push(`/customers[${index}]/transactions[]`, action, true);
    this.db.push('/nextTransactionID', id + 1);
    return action;
  }

  reset() {
    this.db.delete('/');
  }

  private getOrElse<T>(dataPath: string, orElse: T): T {
    return this.db.exists(dataPath) ? this.db.getData(dataPath) : orElse;
  }
}

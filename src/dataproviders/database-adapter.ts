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
  getArticles(): Promise<Article[]> {
    return this.getOrElse('/articles', []);
  }

  async addArticle(article: Article): Promise<Article> {
    const id = await this.getOrElse('/nextArticleID', 0);
    article.id = id;
    article.disabled = article.disabled || false;
    await this.db.push('/articles[]', article, true);
    await this.db.push('/nextArticleID', id + 1);
    return article;
  }

  async getArticleByID(id: number): Promise<Article> {
    return (await this.getArticles()).filter(a => a.id === id)[0];
  }

  async disableArticle(id: number, disabled: boolean): Promise<Article> {
    const article = await this.getArticleByID(id);
    article.disabled = disabled;
    const index = await this.db.getIndex('/articles', article.id);
    await this.db.push(`/articles[${index}]`, article, true);
    return article;
  }

  async updateArticle(id: number, name: string, category: string): Promise<Article> {
    const article = await this.getArticleByID(id);
    article.name = name;
    article.category = category;
    const index = await this.db.getIndex('/articles', article.id);
    await this.db.push(`/articles[${index}]`, article, true);
    return article;
  }

  // Customers

  getCustomers(): Promise<Customer[]> {
    return this.getOrElse('/customers', []);
  }

  async addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const id = await this.getOrElse<number>('/nextCustomerID', 0);

    const newCustomer: Customer = {
      ...customer,
      transactions: [],
      id,
    };

    await this.db.push('/customers[]', newCustomer, true);

    const nextId = id + 1;
    await this.db.push('/nextCustomerID', nextId, true);

    return newCustomer;
  }


  async getCustomerByID(id: number): Promise<Customer> {
    return (await this.getCustomers()).filter(c => c.id === id)[0];
  }

  async updateCustomer(id: number, firstname: string, lastname: string, group: string, details: string): Promise<Customer> {
    const customer = await this.getCustomerByID(id);
    customer.firstname = firstname;
    customer.lastname = lastname;
    customer.details = details;
    customer.group = group;

    const index = await this.db.getIndex('/customers', id);
    await this.db.push(`/customers[${index}]`, customer, true);
    return customer;
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return (await this.getCustomers()).flatMap(c => c.transactions);
  }

  async addTransaction(customerId: number, cart: CartItem[], deposit: number, time: Date): Promise<Transaction> {
    const id = await this.getOrElse('/nextTransactionID', 0);
    const action: Transaction = { id, cart, deposit, time: time.valueOf() };

    const customers = await this.getCustomers();
    const customer = customers.filter(c => c.id === customerId)[0];
    const index = customers.indexOf(customer);
    await this.db.push(`/customers[${index}]/transactions[]`, action, true);
    await this.db.push('/nextTransactionID', id + 1);
    return action;
  }

  reset() {
    this.db.delete('/');
  }

  private async getOrElse<T>(dataPath: string, orElse: T): Promise<T> {
    return this.db.getObjectDefault(dataPath, orElse);
  }
}

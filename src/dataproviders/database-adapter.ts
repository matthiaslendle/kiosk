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
  getArticles() {
    return this.getOrElse('/articles', []) as Promise<Article[]>;
  }

  async addArticle(article: Omit<Article, 'id'>) {
    const id = await this.getOrElse('/nextArticleID', 0);
    const newArticle: Article = {
      ...article,
      id: id.toString(),
      disabled: article.disabled || false
    };

    await this.db.push('/articles[]', newArticle, true);
    await this.db.push('/nextArticleID', id + 1);
    return newArticle;
  }

  async getArticleByID(id: string) {
    console.log('looking for:', id, typeof id);
    const articles = await this.db.filter('/articles', (article: Article) => {
      console.log('checking article:', article);
      console.log('article.id:', article.id, typeof article.id);
      console.log('match:', article.id === id);
      return article.id === id
    });
    console.log('FILTER RESULT:', articles);

    if (!articles?.length) {
      return undefined;
    }
    if (articles.length > 1) {
      throw new Error(`Multiple articles found with ID ${id} check database integrity`);
    }
    return articles[0] as Article;
  }

  async toggleArticle(id: string, disabled: boolean) {
    const article = await this.getArticleByID(id);
    console.log('article:', article);
    if (!article) {
      return undefined
    }
    article.disabled = disabled;
    console.log('start toggle article:', article);
    const index = await this.db.getIndex('/articles', article.id);
    await this.db.push(`/articles[${index}]`, article, true);
    console.log('end toggle article:', article);
    return article;
  }

  async updateArticle(id: string, name: string, category: string) {
    const article = await this.getArticleByID(id);
    if (!article) {
      return undefined;
    }
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
      id: id.toString(),
    };

    await this.db.push('/customers[]', newCustomer, true);

    const nextId = id + 1;
    await this.db.push('/nextCustomerID', nextId, true);

    return newCustomer;
  }


  async getCustomerByID(id: string): Promise<Customer | undefined> {
    const customers = await this.db.filter('/customers', (customer: Customer) => customer.id === id);
    if (!customers?.length) {
      return undefined;
    }
    if (customers.length > 1) {
      throw new Error(`Multiple customers found with ID ${id} check database integrity`);
    }
    return customers[0] as Customer;
  }

  async updateCustomer(id: string, firstname: string, lastname: string, group: string, details: string): Promise<Customer | undefined> {
    const customer = await this.getCustomerByID(id);
    if (!customer) {
      return undefined;
    }
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

  async addTransaction(customerId: string, cart: CartItem[], deposit: number, time: Date): Promise<Transaction> {
    const id = await this.getOrElse('/nextTransactionID', 0);
    const action: Transaction = { id: id.toString(), cart, deposit, time: time.valueOf() };

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

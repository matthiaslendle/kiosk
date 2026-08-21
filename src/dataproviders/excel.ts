import xlsx from 'node-xlsx';
import { promises as fs } from 'fs';
import { DatabaseAdapter } from './database-adapter';

export class ExcelAdapter {
  private dbAdapter: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.dbAdapter = db;
  }

  async save() {

    const customers = [
      ['First Name', 'Last Name', 'Group', 'Details', 'Credit (ct.)'],
      ...(await this.dbAdapter.getCustomers()).map(customer => ([
        customer.firstname,
        customer.lastname,
        customer.group,
        customer.details,
        customer.transactions.reduce((sum, transaction) => sum
          + transaction.deposit
          - transaction.cart.reduce((cartSum, item) => cartSum
            + (item.article.price * item.quantity)
            , 0)
          , 0),
      ]))
    ];

    const articles = [
      ['Name', 'Price (ct.)', 'Category'],
      ...(await this.dbAdapter.getArticles()).map(article => ([
        article.name,
        article.price,
        article.category
      ]))
    ];

    const buffer = xlsx.build([{ name: 'Customers', data: customers, options: {} }, { name: 'Articles', data: articles, options: {} }]);
    await fs.writeFile('kiosk.xlsx', Buffer.from(buffer));
    return { success: true };
  }

  async load(): Promise<{ imported: { customers: number, articles: number } }> {
    const data = xlsx.parse(await fs.readFile('kiosk.xlsx'));
    this.dbAdapter.reset();

    // firstname lastname group details credit
    const customers = data.find(sheet => sheet.name === 'Customers')?.data.slice(1).filter(row => row.length === 5).map(row => {
      const [firstname, lastname, group, details, credit] = row;

      if (typeof firstname !== 'string' || firstname.length < 1) throw new Error(firstname + ' is not a valid first name');
      if (typeof lastname !== 'string' || lastname.length < 1) throw new Error(lastname + ' is not a valid last name');

      return { firstname, lastname, group: group, details: details, credit: parseInt(credit) };
    });

    if (customers) {
      for (const { firstname, lastname, group, details, credit } of customers) {
        const customer = await this.dbAdapter.addCustomer({ firstname, lastname, transactions: [], details, group });
        if (credit !== 0) {
          this.dbAdapter.addTransaction(customer.id, [], credit, new Date());
        }
      };
    }


    const articles = data.find(sheet => sheet.name === 'Articles')?.data.slice(1).filter(row => row.length === 3).map(row => {
      const [name, price, category] = row;
      if (typeof name !== 'string') throw new Error(name + ' is not a valid article name');
      if (typeof price !== 'number') throw new Error(price + ' is not a valid price');
      if (typeof category !== 'string') throw new Error(category + ' is not a valid category');
      return { name, price, category, disabled: false };
    });

    if (articles) {
      for (const { name, price, category, disabled } of articles) {
        await this.dbAdapter.addArticle({ name, price, category, disabled });
      }
    }

    return { imported: { customers: customers?.length || 0, articles: articles?.length || 0 } };
  }
}

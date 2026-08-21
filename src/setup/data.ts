import path from 'path';
import fs from 'fs';

import { Article } from '../models/article';
import { Customer } from '../models/customer';

(() => {
  const json = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '/demoData.json'),
      'utf8'
    )
  );

  const articles: Article[] = json.articles.map(
    (article: Article, index: number) => ({
      ...article,
      id: index.toString(),
      disabled: false
    })
  );

  const nextArticleID = articles.length;

  const customers: Customer[] = json.customers.map(
    (customer: Customer, index: number) => ({
      ...customer,
      id: index.toString(),
      transactions: []
    })
  );

  const nextCustomerID = customers.length;

  const nextTransactionID = 0;

  const data = {
    nextArticleID,
    nextCustomerID,
    nextTransactionID,
    articles,
    customers
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'kiosk.json'),
    JSON.stringify(data)
  );
})()
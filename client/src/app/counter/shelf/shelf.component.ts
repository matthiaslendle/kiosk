import { Component } from '@angular/core';
import { Article } from '../../models/Article';

import { map } from 'rxjs/operators';

import { CartService } from '../../shared/cart.service';
import { ArticleService } from '../../shared/article.service';
import { CurrencyPipe } from '../../shared/currency.pipe';

@Component({
    selector: 'app-shelf',
    templateUrl: './shelf.component.html',
    styleUrls: ['./shelf.component.scss'],
    standalone: false
})
export class ShelfComponent {
  constructor(
    private articleService: ArticleService,
    private cartService: CartService,
    private currency: CurrencyPipe
  ) { }

  byCategory$ = this.articleService.articles$.pipe(
    map(articles => {
      const categories = new Set(articles.filter(a => !a.disabled).map((a) => a.category));

      return Array.from(categories).map((cat) => ({
        title: cat,
        articles: articles.filter((article) => article.category === cat && !article.disabled),
      }));
    })
  );

  addClick(article: Article) {
    this.cartService.addItem(article);
  }

  articleDesc(article: Article) {
    return `${article.name}  (${this.currency.transform(article.price)})`
  }
}

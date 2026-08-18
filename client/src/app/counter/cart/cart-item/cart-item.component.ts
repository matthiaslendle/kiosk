import { Component, Input } from '@angular/core';
import { Article } from 'src/app/models/Article';
import { CartItem } from 'src/app/models/CartItem';

import { CartService } from 'src/app/shared/cart.service';
import { CurrencyPipe } from 'src/app/shared/currency.pipe';

@Component({
    selector: 'app-cart-item',
    templateUrl: './cart-item.component.html',
    styleUrls: ['./cart-item.component.scss'],
    standalone: false
})
export class CartItemComponent {
  @Input() item: CartItem;
  constructor(private cartService: CartService, private currency: CurrencyPipe) { }

  addClick() {
    this.cartService.addItem(this.item.article);
  }

  removeClick() {
    this.cartService.removeItem(this.item.article);
  }

  articleDesc(article: Article) {
    return `${article.name}  (${this.currency.transform(article.price)})`
  }
}

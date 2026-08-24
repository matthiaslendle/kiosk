import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article } from '../models/Article';

import { CartItem } from '../models/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();
  cartSum$ = this.cart$.pipe(
    map(cart => cart.reduce((a, c) => a + c.quantity * c.article.price, 0))
  );

  constructor() { }

  addItem(article: Article) {
    const cart = this.cartSubject.getValue();
    const item = cart.find(e => e.article === article);
    if (item) {
      item.quantity++;
    } else {
      cart.push({ article, quantity: 1 });
    }
    this.cartSubject.next(cart);
  }

  removeItem(article: Article) {
    let cart = this.cartSubject.getValue();
    const item = cart.find(e => e.article === article);
    if (item) {
      item.quantity--;
      if (item.quantity === 0) {
        cart = cart.filter(e => e.quantity > 0);
      }
      this.cartSubject.next(cart);
    }
  }

  clearCart() {
    this.cartSubject.next([])
  }
}

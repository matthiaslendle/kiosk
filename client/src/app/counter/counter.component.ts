import { Component } from '@angular/core';

import { CartItem } from '../models/CartItem';
import { map } from 'rxjs/operators';
import { CustomerService } from '../shared/customer.service';
import { CartService } from '../shared/cart.service';
import { Customer } from '../models/Customer';
import { ArticleService } from '../shared/article.service';
import { combineLatest, Subject } from 'rxjs';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  standalone: false
})
export class CounterComponent {
  articles$ = this.articleService.articles$;
  // byCategory$ = this.articles$.pipe(
  //   map(articles => articles.filter(article => !article.disabled).reduce((byCategory, article) => {
  //     if (!byCategory[article.category]) {
  //       byCategory[article.category] = [];
  //     }
  //     byCategory[article.category].push(article);
  //     return byCategory;
  //   }, {}
  //   ))
  // );

  cart$ = this.cartService.cart$;
  cart: CartItem[] = [];
  cartSum$ = this.cartService.cartSum$;
  selectedCustomer$ = this.customerService.selectedCustomer$;
  selectedCustomer: Customer | null = null;

  credit$ = this.selectedCustomer$.pipe(
    map(customer => customer ? this.customerService.calculateCredit(customer) : 0)
  );

  overdrawn$ = combineLatest([this.cartSum$, this.credit$]).pipe(
    map(([cart, credit]: [number, number]) => credit < cart)
  )


  clearEventSubjet: Subject<void> = new Subject<void>();

  constructor(private articleService: ArticleService, private customerService: CustomerService, private cartService: CartService) {
    this.customerService.clearSelectedCustomer();
    this.cart$.subscribe(cart => this.cart = cart);
    this.selectedCustomer$.subscribe(customer => this.selectedCustomer = customer);
  }

  submit() {
    if (!this.cart.length || !this.selectedCustomer) return;
    this.customerService.addTransaction(this.selectedCustomer.id, this.cart, 0);
    this.customerService.clearSelectedCustomer();
    this.clearEventSubjet.next();
    this.cartService.clearCart();
  }
}

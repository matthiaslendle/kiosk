import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CartItem } from 'src/app/models/CartItem';

import { CartService } from '../../shared/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    standalone: false
})
export class CartComponent {
  // @Input() cart: CartItem[];
  // @Output() changeQuantity: EventEmitter<CartItem> = new EventEmitter();

  constructor(private cartService: CartService) { }

  cart$ = this.cartService.cart$;
  cartSum$ = this.cartService.cartSum$;

  onQuantityChange(item: CartItem) {
    // this.changeQuantity.emit(item);
  }
}

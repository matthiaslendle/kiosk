import { Component } from '@angular/core';
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

  onQuantityChange() {
    throw "Unimplimented";
  }
}

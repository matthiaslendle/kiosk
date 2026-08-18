import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartItem } from 'src/app/models/CartItem';
import { Transaction } from 'src/app/models/Transaction';
import { CurrencyPipe } from 'src/app/shared/currency.pipe';

@Component({
    selector: 'app-customer-detail-dialog',
    templateUrl: './customer-detail-dialog.component.html',
    styleUrls: ['./customer-detail-dialog.component.scss'],
    standalone: false
})
export class CustomerDetailDialogComponent implements OnInit {
  displayedCols = ['time', 'deposit', 'cart', 'sum'];

  constructor(
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    private currency: CurrencyPipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  details = this.data.details;

  close() {
    this.dialogRef.close();
  }

  calculateAction(transaction: Transaction) {
    return (
      transaction.deposit +
      transaction.cart.reduce((a, i) => a + i.article.price * i.quantity, 0)
    );
  }

  cartSummary(cart: CartItem[]) {
    return cart.map(
      item =>
        `${item.quantity}x ${item.article.name} (${this.currency.transform(
          item.article.price
        )})`
    )
      .join('\n');
  }

  transactionSum(transaction: Transaction) {
    return (
      transaction.deposit -
      transaction.cart.reduce((sum, item) => sum + item.quantity * item.article.price, 0)
    );
  }

  ngOnInit() { }
}

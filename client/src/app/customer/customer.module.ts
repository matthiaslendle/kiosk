import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CustomerDetailDialogComponent } from './customer-detail-dialog/customer-detail-dialog.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { DepositDialogComponent } from './deposit-dialog/deposit-dialog.component';
import { NewCustomerDialogComponent } from './new-customer-dialog/new-customer-dialog.component';

@NgModule({
  declarations: [
    CustomerTableComponent,
    NewCustomerDialogComponent,
    DepositDialogComponent,
    CustomerDetailDialogComponent,
  ],
  imports: [CommonModule, SharedModule]
})
export class CustomerModule {}

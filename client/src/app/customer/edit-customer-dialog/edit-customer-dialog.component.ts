import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/shared/customer.service';

@Component({
    selector: 'app-edit-customer-dialog',
    templateUrl: './edit-customer-dialog.component.html',
    styleUrls: ['./edit-customer-dialog.component.scss'],
    standalone: false
})
export class EditCustomerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

}

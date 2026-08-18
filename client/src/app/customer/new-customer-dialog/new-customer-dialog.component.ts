import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { last } from 'rxjs/operators';

@Component({
    selector: 'app-new-customer-dialog',
    styleUrls: ['new-customer-dialog.component.scss'],
    templateUrl: './new-customer-dialog.component.html',
    standalone: false
})
export class NewCustomerDialogComponent implements OnInit {
  data: {
    firstname: string,
    lastname: string,
    details: string,
    credit: string,
    group: string,
  } = {
      firstname: '',
      lastname: '',
      details: '',
      credit: '',
      group: ''
    }

  constructor(public dialogRef: MatDialogRef<NewCustomerDialogComponent>) { }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() { }
}

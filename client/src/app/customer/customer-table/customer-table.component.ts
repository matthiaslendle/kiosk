import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

import { Customer } from '../../models/Customer';
import { CustomerDetailDialogComponent } from '../customer-detail-dialog/customer-detail-dialog.component';
import { DepositDialogComponent } from '../deposit-dialog/deposit-dialog.component';
import { NewCustomerDialogComponent } from '../new-customer-dialog/new-customer-dialog.component';
import { CustomerService } from '../../shared/customer.service';
import { Transaction } from '../../models/Transaction';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { EditCustomerDialogComponent } from '../../customer/edit-customer-dialog/edit-customer-dialog.component';

interface TableDataModel {
  firstname: string;
  lastname: string;
  group: string;
  transactions: Transaction[];
  credit: number;
  deposit: () => void;
  details: () => void;
}

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
  standalone: false
})
export class CustomerTableComponent implements OnInit {
  displayedCols = ['firstname', 'lastname', 'group', 'credit', 'deposit', 'details', 'edit'];
  tableData: MatTableDataSource<TableDataModel> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = new MatPaginator();
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  filter = new FormControl('');

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerService.customers$.pipe(
      map((customers): TableDataModel[] => customers.map(customer => ({
        ...customer,
        credit: this.customerService.calculateCredit(customer),
        deposit: () => this.openDeposit(customer),
        details: () => this.showDetails(customer),
        edit: () => this.openEditDialog(customer)
      })))
    ).subscribe(data => this.tableData.data = data);

    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
    this.filter.valueChanges.subscribe(value => this.tableData.filter = value?.trim().toLowerCase() || '')
  }

  openDeposit(customer: Customer) {
    this.dialog
      .open(DepositDialogComponent, { data: customer })
      .afterClosed()
      .subscribe(amount => {
        if (amount) {
          const cents = Math.floor(parseFloat(amount.replace(",", ".")) * 100)
          this.customerService.addTransaction(customer.id, [], cents)
        }
      });
  }

  openNewDialog(): void {
    this.dialog.open(NewCustomerDialogComponent)
      .afterClosed()
      .subscribe((data: { firstname: string, lastname: string, group: string, details: string, credit: string }) => {
        if (data !== undefined) {
          const cents = Math.floor(parseFloat(data.credit.replace(",", ".")) * 100)
          this.customerService.addCustomer(data.firstname, data.lastname, data.group, data.details, cents || 0)
        }
      });
  }

  showDetails(customer: Customer) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: {
        firstname: customer.firstname,
        lastname: customer.lastname,
        transactions: customer.transactions,
        details: customer.details,
        group: customer.group
      },
    });
  }

  openEditDialog(customer: Customer) {
    this.dialog
      .open(EditCustomerDialogComponent, {
        data: { ...customer, credit: this.customerService.calculateCredit(customer) }
      })
      .afterClosed()
      .subscribe((data: { id: number, firstname: string, lastname: string, group: string, details: string }) => {
        if (data !== undefined) {
          this.customerService.editCustomer(data.id, data.firstname, data.lastname, data.details, data.group)
        }
      })
  }
}

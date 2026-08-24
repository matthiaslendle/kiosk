import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Customer } from '../../models/Customer';
import { CustomerService } from '../../shared/customer.service';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-picker',
  styleUrls: ['./customer-picker.component.scss'],
  templateUrl: './customer-picker.component.html',
  standalone: false
})
export class CustomerPickerComponent implements OnInit {

  customers$ = this.customerService.customers$;
  selected$ = this.customerService.selectedCustomer$;
  customerCtrl = new FormControl();
  filteredOptions: Observable<string[]> = new Observable();

  @Input() clearEvent: Observable<void> = new Observable();

  data: Record<string, Customer> = {};

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {

    this.customers$.subscribe(customers => {
      customers.forEach(customer => {
        this.data[this.customerFullName(customer)] = customer;
      });
      this.filteredOptions = this.customerCtrl.valueChanges.pipe(
        startWith(''),
        tap(value => {
          const customer = this.data[value];
          if (customer)
            this.customerService.selectCustomer(customer);
          else
            this.customerService.clearSelectedCustomer();
        }),
        map(value => this.filter(value))
      )
    });

    this.clearEvent.subscribe(() => this.customerCtrl.setValue(''));

  }

  private filter(value: string) {
    const filterValue = value.toLowerCase();
    return Object.keys(this.data).filter(option => option.toLowerCase().startsWith(filterValue))
  }

  customerFullName(customer: Customer) {
    return `${customer.firstname} ${customer.lastname}`;
  }

  clearButtonClick() {
    this.customerService.clearSelectedCustomer();
    this.customerCtrl.setValue('')
  }
}

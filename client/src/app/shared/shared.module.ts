import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

import { CurrencyPipe } from './currency.pipe';

@NgModule({
  declarations: [
    CurrencyPipe,
  ],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [
    MaterialModule,
    FormsModule,
    CurrencyPipe,
  ],
})
export class SharedModule { }

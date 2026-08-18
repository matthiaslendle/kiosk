import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currency',
    standalone: false
})
@Injectable({ providedIn: 'root' })
export class CurrencyPipe implements PipeTransform {
  constructor() {}

  transform(value: number): string {
    return `${value < 0 ? '- ' : ''}${(Math.abs(value) / 100).toFixed(2)} €`;
  }
}

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-keyvalues',
    templateUrl: './keyvalues.component.html',
    styleUrls: ['./keyvalues.component.scss'],
    standalone: false
})
export class KeyvaluesComponent {
  @Input() sum: number;
  @Input() credit: number;
}

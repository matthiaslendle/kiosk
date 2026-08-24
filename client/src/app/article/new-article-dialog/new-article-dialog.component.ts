import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-article-dialog',
  templateUrl: './new-article-dialog.component.html',
  styleUrls: ['./new-article-dialog.component.scss'],
  standalone: false
})
export class NewArticleDialogComponent implements OnInit {
  data: { name: string; category: string; price: string } = {
    name: '',
    category: '',
    price: '',
  };
  constructor(public dialogRef: MatDialogRef<NewArticleDialogComponent>) { }
  close() {
    this.dialogRef.close();
  }
  ngOnInit() { }
}

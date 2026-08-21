import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '../../models/Article';

@Component({
    selector: 'app-edit-article-dialog',
    templateUrl: './edit-article-dialog.component.html',
    styleUrls: ['./edit-article-dialog.component.scss'],
    standalone: false
})
export class EditArticleDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Article
  ) { }

  close() {
    this.dialogRef.close();
  }
  ngOnInit() { }

}

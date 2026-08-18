import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ArticleTableComponent } from './article-table/article-table.component';
import { NewArticleDialogComponent } from './new-article-dialog/new-article-dialog.component';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';

@NgModule({
  declarations: [ArticleTableComponent, NewArticleDialogComponent, EditArticleDialogComponent],
  imports: [CommonModule, SharedModule]
})
export class ArticleModule { }

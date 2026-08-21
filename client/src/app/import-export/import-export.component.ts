import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../shared/api.service';
import { ArticleService } from '../shared/article.service';
import { CustomerService } from '../shared/customer.service';

@Component({
    selector: 'app-import-export',
    templateUrl: './import-export.component.html',
    styleUrls: ['./import-export.component.scss'],
    standalone: false
})

export class ImportExportComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private customerService: CustomerService,
    private articleService: ArticleService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  export() {
    this.apiService.export().subscribe(
      () => this.snackBar.open('erfolgreich Exportiert')._dismissAfter(2000),
      () => this.snackBar.open('Export fehlgeschlagen')._dismissAfter(2000)
    );
  }

  import() {
    this.apiService.import().subscribe(({ imported }) => {
      this.snackBar.open(`${imported.customers} Teilnehmer und ${imported.articles} Artikel importiert.`)._dismissAfter(2000)
      this.customerService.fetchCustomers();
      this.articleService.fetchArticles();
    }, () => {
      this.snackBar.open('Import fehlgeschlagen!')._dismissAfter(2000)
    })
  }

}

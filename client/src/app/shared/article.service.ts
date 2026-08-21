import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Article } from '../models/Article';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articlesSubject = new BehaviorSubject<Article[]>([]);
  articles$ = this.articlesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.fetchArticles();
  }

  fetchArticles() {
    this.apiService.getAllArticles()
      .subscribe(articles => this.articlesSubject.next(articles));
  }

  addArticle(name: string, category: string, price: number) {
    this.apiService.addArticle(name, category, price).subscribe(article => {
      const articles = this.articlesSubject.getValue();
      articles.push(article);
      this.articlesSubject.next(articles);
    });
  }

  toggle(article: Article) {
    this.apiService.toggleArticle(article.id, !article.disabled)
      .subscribe(a => {
        const oldArticles = this.articlesSubject.getValue();
        console.log('toggle article', a);
        console.log('oldArticles', oldArticles);
        const newArticles = oldArticles.map(aIt =>
          aIt.id === a.id ? a : aIt
        );
        console.log('newArticles', newArticles);
        this.articlesSubject.next(newArticles);
      });
  }

  editArticle(id: string, name: string, category: string) {
    this.apiService.updateArticle(id, name, category)
      .subscribe(a => {
        const oldArticles = this.articlesSubject.getValue();
        const newArticles = oldArticles.map(aIt =>
          aIt.id === a.id ? a : aIt
        );
        this.articlesSubject.next(newArticles);
      })
  }
}

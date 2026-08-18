import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArticleModule } from './article/article.module';
import { CounterModule } from './counter/counter.module';
import { CustomerModule } from './customer/customer.module';
import { MaterialModule } from './shared/material.module';
import { ImportExportComponent } from './import-export/import-export.component';
import { EditCustomerDialogComponent } from './customer/edit-customer-dialog/edit-customer-dialog.component';


registerLocaleData(localeDe);

@NgModule({ declarations: [AppComponent, ImportExportComponent, EditCustomerDialogComponent],
    exports: [],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CustomerModule,
        ArticleModule,
        CounterModule,
        MaterialModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }

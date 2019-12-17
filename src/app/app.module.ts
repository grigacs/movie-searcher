import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './movie/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from 'ngx-icons';
import { ListComponent } from './movie/list/list.component';
import { DetailsComponent } from './movie/details/details.component';
import { PopupComponent } from './movie/details/popup/popup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpErrorInterceptor } from './error/http-error.interceptor';
import { ErrorComponent } from './error/error/error.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    MainComponent,
    ListComponent,
    DetailsComponent,
    PopupComponent,
    PageNotFoundComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    RouterModule,
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { App } from './app';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { BookSearch } from './components/book-search/book-search';
import { AppRoutingModule } from './app-routing-module';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'book-search', component: BookSearch }
];

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    BookSearch
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
    // RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }





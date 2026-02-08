import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { BookSearch } from './components/book-search/book-search';
import { AuthGuard } from './auth-guard'; // Import the guard you created

const routes: Routes = [
  // 1. Default path redirects to Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Public paths
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // 3. Protected path - Only accessible if AuthGuard returns true
  { 
    path: 'book-search', 
    component: BookSearch, 
    canActivate: [AuthGuard] 
  },

  // 4. Wildcard path (Optional: redirects any unknown URL to login)
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
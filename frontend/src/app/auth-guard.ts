import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

canActivate(): boolean {
    const role = localStorage.getItem('userRole');

    // Check if role is null, undefined, or an empty string
    if (role === null || role === undefined || role === '') {
      this.router.navigate(['/login']);
      return false;
    }

    return true; 
  }
}
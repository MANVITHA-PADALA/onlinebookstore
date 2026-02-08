import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class Login {
  user = { email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

onLogin() {
  this.auth.login(this.user).subscribe({
    next: (res) => {
      if (res === 'Login Successful') {
        // Updated Logic: Only admin@gmail.com gets 'admin' role, everyone else is 'user'
        const role = (this.user.email === 'admin@gmail.com') ? 'admin' : 'user';
        localStorage.setItem('userRole', role);
        this.router.navigate(['/book-search']);
      } else {
        alert(res);
      }
    },
    error: (err) => {
      console.error(err);
      alert("An error occurred during login");
    }
  });
}
}
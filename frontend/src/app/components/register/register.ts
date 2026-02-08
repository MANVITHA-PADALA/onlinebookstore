import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class Register {
  user = { username: '', email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.auth.register(this.user).subscribe(() => {
      alert('Registration successful!');
      this.router.navigate(['/login']);
    });
  }
}
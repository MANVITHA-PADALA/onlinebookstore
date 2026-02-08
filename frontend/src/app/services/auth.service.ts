import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    // Note: ResponseType text because your backend returns a String "Login Successful"
    return this.http.post(`${this.url}/login`, user, { responseType: 'text' });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.url}/register`, user);
  }
}
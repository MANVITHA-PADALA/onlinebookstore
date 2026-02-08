import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private url = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any[]> { return this.http.get<any[]>(this.url); }
  
  searchBooks(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/search?query=${query}`);
  }

  addBook(book: any): Observable<any> { return this.http.post(this.url, book); }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, book);
  }

  deleteBook(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
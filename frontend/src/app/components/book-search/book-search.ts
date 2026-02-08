import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.html',
  styleUrls: ['./book-search.css'],
  standalone: false
})
export class BookSearch implements OnInit {
  public books: any[] = [];
  public searchTerm: string = '';
  public role: string | null = '';
  public isEdit: boolean = false;
  public currentId: number | null = null;
  public newBook = { title: '', author: '', price: 0, stock: 0 };

  constructor(
    private bookService: BookService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('userRole') || 'user';
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => {
      this.books = [...data];
      this.cdr.detectChanges();
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) return this.loadBooks();
    this.bookService.searchBooks(this.searchTerm).subscribe(data => {
      this.books = [...data];
      this.cdr.detectChanges();
    });
  }

  addOrUpdate() {
    if (this.isEdit && this.currentId) {
      this.bookService.updateBook(this.currentId, this.newBook).subscribe(() => this.reset());
    } else {
      this.bookService.addBook(this.newBook).subscribe(() => this.reset());
    }
  }

  edit(book: any) {
    this.isEdit = true;
    this.currentId = book.id;
    this.newBook = { ...book };
  }

  delete(id: number) {
    if (confirm('Delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
    }
  }

  reset() {
    this.isEdit = false;
    this.currentId = null;
    this.newBook = { title: '', author: '', price: 0, stock: 0 };
    this.loadBooks();
  }

  logout() {
    localStorage.removeItem('userRole'); // This "locks" the dashboard again
    localStorage.clear(); // Optional: clears everything
  this.router.navigate(['/login']);
  }
}
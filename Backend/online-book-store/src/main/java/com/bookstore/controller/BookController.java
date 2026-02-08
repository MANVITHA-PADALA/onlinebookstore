package com.bookstore.controller;

import com.bookstore.model.Book;
import com.bookstore.service.BookService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT})
public class BookController {
	@Autowired
	private BookService bookService;
	
	@GetMapping
	public List<Book> getAllBooks() {
	    // Use the built-in repository method directly
		return bookService.getAllBooks();
	}
	@GetMapping("/search")
	public List<Book> searchBooks(@RequestParam String query) {
	    return bookService.searchBooks(query);
	}

	@PostMapping
	public void addBook(@Valid @RequestBody Book book) {
		bookService.save(book);
	}

	@DeleteMapping("/{id}")
	public void deleteBook(@PathVariable Long id) {
		bookService.delete(id);
	}
	
	@PutMapping("/{id}")
	public Book updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails) {
	    return bookService.updateBook(id, bookDetails); 
	}
}

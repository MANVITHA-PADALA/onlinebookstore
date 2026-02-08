package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList; // Corrected import

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;
    
    // Logic: Usually, you don't need a local List variable if you have a Repository.
    // The Repository handles the data persistence.

    public List<Book> searchBooks(String term) {
        return bookRepository.findByTitleContainingOrAuthorContaining(term, term);
    }
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll(); // Standard JpaRepository method
    }

    public void save(Book book) {
        bookRepository.save(book);
    }

    public void delete(Long id) {
        bookRepository.deleteById(id);
    }
    
    public Book updateBook(Long id, Book bookDetails) {
        // 1. Find the existing book by ID
        Book existingBook = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        // 2. Update the fields with new data from the frontend
        existingBook.setTitle(bookDetails.getTitle());
        existingBook.setAuthor(bookDetails.getAuthor());
        existingBook.setPrice(bookDetails.getPrice());
        existingBook.setStock(bookDetails.getStock());

        // 3. Save the updated book back to MySQL
        return bookRepository.save(existingBook);
    }

}
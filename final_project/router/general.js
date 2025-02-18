import express from "express";
import books from "./booksdb.js";
import { isValid, users } from "./auth_users.js";
import axios from 'axios';
const public_users = express.Router();


public_users.post("/register", (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return response.status(400).json({ message: "Username already exists" });
  }

  users[username] = { password };
  response.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', (request, response) => {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Error fetching book list");
    }
  })
  .then(bookList => {
    response.send(bookList);
  })
  .catch(error => {
    response.status(500).json({ message: error });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (request, response) => {
  const isbn = request.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => {
    response.send(book);
  })
  .catch(error => {
    response.status(404).json({ message: error });
  });
});

// Get book details based on author
public_users.get('/author/:author', (request, response) => {
  const author = request.params.author;
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found by this author");
    }
  })
  .then(booksByAuthor => {
    response.send(booksByAuthor);
  })
  .catch(error => {
    response.status(404).json({ message: error });
  });
});

// Get all books based on title
public_users.get('/title/:title', (request, response) => {
  const title = request.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  })
  .then(booksByTitle => {
    response.send(booksByTitle);
  })
  .catch(error => {
    response.status(404).json({ message: error });
  });
});

//  Get book review
public_users.get('/review/:isbn', (request, response) => {
  const isbn = request.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    response.send(book.reviews);
  } else {
    response.status(404).json({message: "No reviews found for this book"});
  }
});

export const public_routes = public_users;

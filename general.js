const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (Task 10 / Async callback equivalent)
public_users.get('/',function (req, res) {
  // Using Promise / Async-Await style as required for Task 11
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((bookList) => {
    return res.status(200).json(JSON.stringify(bookList, null, 4));
  });
});

// Get book details based on ISBN (Task 11 requirement with Promises/Async-Await)
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByISBN = new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({status: 404, message: "Book not found"});
    }
  });

  getBookByISBN.then((book) => {
    return res.status(200).json(book);
  }).catch((error) => {
    return res.status(error.status).json({message: error.message});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchedBooks = [];
    let keys = Object.keys(books);
    keys.forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        matchedBooks.push({"isbn": isbn, ...books[isbn]});
      }
    });

    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject({status: 404, message: "Author not found"});
    }
  });

  getBooksByAuthor.then((matchedBooks) => {
    return res.status(200).json({booksbyauthor: matchedBooks});
  }).catch((error) => {
    return res.status(error.status).json({message: error.message});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchedBooks = [];
    let keys = Object.keys(books);
    keys.forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks.push({"isbn": isbn, ...books[isbn]});
      }
    });

    if (matchedBooks.length > 0) {
      resolve(matchedBooks);
    } else {
      reject({status: 404, message: "Title not found"});
    }
  });

  getBooksByTitle.then((matchedBooks) => {
    return res.status(200).json({bookbytitle: matchedBooks});
  }).catch((error) => {
    return res.status(error.status).json({message: error.message});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

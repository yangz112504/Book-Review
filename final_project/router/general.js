const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.user;
  const pswd = req.body.password;
  if(username && pswd){
    if(!isValid(username)){
      users.push({"username": username, "password": pswd});
      return res.status(200).json({message: "User successfully registered"});
    }else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books));
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book));
  } else {
    return res.status(403).json({ message: "Cannot find book" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let filteredBooks = [];
  let booksKeys = Object.keys(books);
  booksKeys.forEach((bookKey) => {
    if (books[bookKey].author === req.params.author) {
      filteredBooks.push(books[bookKey]);
    }
  });
  return res.send(JSON.stringify(filteredBooks));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let filteredBooks = [];
  let booksKeys = Object.keys(books);
  booksKeys.forEach((bookKey) => {
    if (books[bookKey].title === req.params.title) {
      filteredBooks.push(books[bookKey]);
    }
  });
  return res.send(JSON.stringify(filteredBooks));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    res.send(JSON.stringify(book.reviews));
  }else {
    return res.status(403).json({ message: "Cannot find book" });
  }
});

module.exports.general = public_users;

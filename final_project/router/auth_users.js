const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let validUser = users.filter((user) => {
    return user.username === username;
  });
  if (validUser && validUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};


//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const user = req.body.username;
  const pswd = req.body.password;
  if(!user || !pswd){
    return res.status(400).json({message: "Username and password are required!"});
  }
  if(authenticatedUser(user, pswd)){
    const accessToken = jwt.sign({username: user}, 'access');
    return res.status(200).json({token: accessToken})
  }else{ 
    return res.status(403).json({ message: "You are not a registered user" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  if(!review){
    return res.status(400).json({message: "review is required"});
  }
  let book = books[isbn];
  if(book){
    book.reviews[req.username] = review;
    return res.status(200).json({message: "Review added"})
  }else{
    return res.status(403).json({message: "Review not added"})

  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    if(book.reviews[req.username]){
      delete book.reviews[req.username];
      return res.status(200).send("Review successfully deleted");
    }else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  }
  return res.status(403).json({ message: "The book doesn't exist in the library" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

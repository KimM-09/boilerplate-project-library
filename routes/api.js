/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config()
let mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: [String],
    commentcount: {type: Number, default: 0}
  })

  const Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(async function (req, res){
      let books = await Book.find({}, 'title commentcount').exec();
      return res.json(books);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if(!title) {
        return res.send('missing required field title')
      }
      try {
        let newBook = await new Book({title}).save();
        return res.json({_id: newBook._id, title: newBook.title});
      } catch(err) {
        return res.send('could not create book');
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      await Book.deleteMany({});
      return res.send('complete delete successful');
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try {
        let book = await Book.findById(bookid).exec();
        if(!book) {
          return res.send('no book exists');
        }
        return res.json({_id: book._id, title: book.title, comments: book.comments});
      } catch(err) {
        return res.send('no book exists');
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment) {
        return res.send('missing required field comment');
      }
      try {
        let book = await Book.findById(bookid).exec();
        if(!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        await book.save();
        return res.json({_id: book._id, title: book.title, comments: book.comments});
      } catch(err) {
        return res.send('no book exists');
      }
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        let book = await Book.findById(bookid).exec();
        if(!book) {
          return res.send('no book exists');
        }
        await Book.findByIdAndDelete(bookid).exec();
        return res.send('delete successful');
      } catch(err) {
        return res.send('no book exists');
      }
      //if successful response will be 'delete successful'
    });
  
};

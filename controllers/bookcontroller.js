const Book =require('../models/bookModel')
const Review=require("../models/reviewModel")
const { validationResult } = require('express-validator');

const  createBook= async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bookData = {
      ...req.body,
      addedBy: req.user._id
    };

    const book = new Book(bookData);
    await book.save();
    await book.populate('addedBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while adding book',
      error: error.message
    });
  }
};

const getAllBooks= async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }
    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: 'i' };
    }

    let sort = { createdAt: -1 }; 
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const books = await Book.find(filter)
      .populate('addedBy', 'username')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books',
      error: error.message
    });
  }
};

const getBookById= async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const book = await Book.findById(id).populate('addedBy', 'username email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ book: id });
    const totalPages = Math.ceil(totalReviews / limit);

    res.json({
      success: true,
      data: {
        book,
        reviews,
        reviewsPagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book details',
      error: error.message
    });
  }
};

module.exports={createBook,getAllBooks,getBookById}


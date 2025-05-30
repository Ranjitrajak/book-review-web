const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);
reviewSchema.post('save', async function() {
  await this.constructor.updateBookRating(this.book);
});

reviewSchema.post('remove', async function() {
  await this.constructor.updateBookRating(this.book);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await this.model.updateBookRating(doc.book);
  }
});

reviewSchema.statics.updateBookRating = async function(bookId) {
  const stats = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const Book = mongoose.model('Book');
  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};
module.exports=mongoose.model("Review",reviewSchema)
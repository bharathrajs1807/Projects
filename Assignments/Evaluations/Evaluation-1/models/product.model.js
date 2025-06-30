const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title must be at most 100 characters long']
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        rate: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

productSchema.index({ title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

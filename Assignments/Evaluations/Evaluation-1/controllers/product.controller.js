const Product = require('../models/product.model');
const User = require('../models/user.model');

module.exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await Product.find().skip((page - 1) * limit).limit(limit);
        res.status(200).json({ message: 'All products fetched successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

module.exports.getTopExpensiveProducts = async (req, res) => {
    try {
        const { n = 5 } = req.query;
        const products = await Product.find().sort({ price: -1 }).limit(n);
        res.status(200).json({ message: `Top ${n} expensive products fetched successfully`, products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top expensive products', error: error.message });
    }
};

module.exports.getTopSellers = async (req, res) => {
    try {
        const { n = 5 } = req.query;
        const topSellers = await Product.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalProducts: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $sort: {
                    totalProducts: -1
                }
            },
            {
                $limit: parseInt(n)
            }
        ]);
        res.status(200).json({ message: `Top ${n} sellers fetched successfully`, topSellers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top sellers', error: error.message });
    }
};

module.exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: `Product fetched successfully`, product });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newProduct = new Product(req.body);
        newProduct.userId = user._id;
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: `Product updated successfully`, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: `Product deleted successfully`, product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

module.exports.searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        const products = await Product.find({ $text: { $search: query } });
        res.status(200).json({ message: `Products searched with query: ${query}`, products });
    } catch (error) {
        res.status(500).json({ message: 'Error searching products', error: error.message });
    }
};

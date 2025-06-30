const express = require('express');

const ProductController = require('../controllers/product.controller');

const ProductRouter = express.Router();

ProductRouter.get('/', ProductController.getAllProducts);
ProductRouter.get('/top-expensive', ProductController.getTopExpensiveProducts);
ProductRouter.get('/top-sellers', ProductController.getTopSellers);
ProductRouter.get('/:id', ProductController.getProductById);
ProductRouter.post('/', ProductController.createProduct);
ProductRouter.put('/:id', ProductController.updateProduct);
ProductRouter.delete('/:id', ProductController.deleteProduct);
ProductRouter.get('/search', ProductController.searchProducts);

module.exports = ProductRouter;
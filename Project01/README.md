# Inventory Management System

This is a simple inventory management system that allows you to manage products, sales data, stock, and pricing. The system simulates the behavior of two inventories: `inventory1` (your inventory) and `inventory2` (a competitor’s inventory). You can perform a variety of operations such as adding products, updating prices, modifying stock, comparing inventories, and more.

## Features

- **Inventory Management**: Manage products, including name, price, stock, and demand.
- **Sales Data**: Automatically generates random sales data for each product for a year (365 days), including maximum and average sales.
- **Price Management**: Prices are dynamically updated based on stock levels and demand.
- **Stock Management**: Add or subtract stock from products.
- **Comparison**: Compare the products, prices, sales data, and stock between your inventory and a competitor's inventory.
- **User Interaction**: A prompt-based interface that allows users to interact with the inventory system.

## Usage

Once the system is running, you'll be prompted with a menu of options:

1. **View All Products**: View details of all products in your inventory.
2. **Compare Inventories**: Compare the products, stock, and prices between your inventory and the competitor’s inventory.
3. **Update Prices**: Adjust the prices of products in your inventory based on demand and stock levels.
4. **Update Stock**: Add or subtract stock from products.
5. **Exit**: Exit the program.

Example of product data:

```plaintext
Product: iPhone
Price: 50000
Stock: 1000
Demand: High

Average Sales Record: 100
Maximum Sales Record: 250
Remaining Stock: 800
New Price: 51000

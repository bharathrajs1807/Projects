# Evaluation-1

## Project Setup

1. **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Evaluation-1
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Start the server**
    ```bash
    npm start
    ```

---

## API Endpoints

### Authentication

#### 1. `POST /api/auth/register`
- **Description:** Register a new user.
- **Request:**
  ```json
  {
    "username": "user1",
    "email": "user1@gmail.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

---

#### 2. `POST /api/auth/login`
- **Description:** Login a user.
- **Request:**
  ```json
  {
    "email": "user1@gmail.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful"
  }
  ```

---

#### 3. `POST /api/auth/logout`
- **Description:** Logout the current user.
- **Request:**  
  No body required.
- **Response:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

### Products

#### 4. `GET /api/products`
- **Description:** Fetch all products.
- **Request:**  
  No body required.
- **Response:**
  ```json
  [
    {
      "title": "Smartphone",
      "price": 499,
      "description": "Latest model smartphone",
      "category": "electronics",
      "image": "https://example.com/smartphone.jpg",
      "rating": {
        "rate": 4.7,
        "count": 230
      },
      "userId": "60d0fe4f5311236168a109ca"
    }
  ]
  ```

---

#### 5. `GET /api/products/top-expensive`
- **Description:** Fetch top expensive products.
- **Request:**  
  No body required.
- **Response:**
  ```json
  [
    {
      "title": "Expensive Product",
      "price": 999,
      "description": "High-end product",
      "category": "electronics",
      "image": "https://example.com/expensive.jpg",
      "rating": {
        "rate": 4.9,
        "count": 100
      },
      "userId": "60d0fe4f5311236168a109ca"
    }
  ]
  ```

---

#### 6. `GET /api/products/top-sellers`
- **Description:** Fetch top selling products.
- **Request:**  
  No body required.
- **Response:**
  ```json
  [
    {
      "title": "Top Seller",
      "price": 150,
      "description": "Best selling product",
      "category": "electronics",
      "image": "https://example.com/topseller.jpg",
      "rating": {
        "rate": 4.8,
        "count": 500
      },
      "userId": "60d0fe4f5311236168a109ca"
    }
  ]
  ```

---

#### 7. `GET /api/products/search?query=keyword`
- **Description:** Search products by keyword.
- **Request:**  
  No body required.
- **Response:**
  ```json
  [
    {
      "title": "Searched Product",
      "price": 120,
      "description": "Matches keyword",
      "category": "electronics",
      "image": "https://example.com/searched.jpg",
      "rating": {
        "rate": 4.2,
        "count": 80
      },
      "userId": "60d0fe4f5311236168a109ca"
    }
  ]
  ```

---

#### 8. `GET /api/products/:id`
- **Description:** Fetch a single product by ID.
- **Request:**  
  No body required.
- **Response:**
  ```json
  {
    "title": "Product Name",
    "price": 100,
    "description": "Product Description",
    "category": "electronics",
    "image": "https://example.com/product.jpg",
    "rating": {
      "rate": 4.0,
      "count": 50
    },
    "userId": "60d0fe4f5311236168a109ca"
  }
  ```

---

#### 9. `POST /api/products`
- **Description:** Create a new product.
- **Request:**
  ```json
  {
    "title": "Product Title",
    "price": 100,
    "description": "Product Description",
    "category": "electronics",
    "image": "https://example.com/image.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    }
  }
  ```
- **Response:**
  ```json
  {
    "title": "Product Title",
    "price": 100,
    "description": "Product Description",
    "category": "electronics",
    "image": "https://example.com/image.jpg",
    "rating": {
      "rate": 4.5,
      "count": 120
    },
    "userId": "60d0fe4f5311236168a109ca"
  }
  ```

---

#### 10. `PUT /api/products/:id`
- **Description:** Update a product by ID.
- **Request:**
  ```json
  {
    "title": "Updated Product",
    "price": 250,
    "description": "Updated details",
    "category": "electronics",
    "image": "https://example.com/updated.jpg",
    "rating": {
      "rate": 4.6,
      "count": 130
    }
  }
  ```
- **Response:**
  ```json
  {
    "title": "Updated Product",
    "price": 250,
    "description": "Updated details",
    "category": "electronics",
    "image": "https://example.com/updated.jpg",
    "rating": {
      "rate": 4.6,
      "count": 130
    },
    "userId": "60d0fe4f5311236168a109ca"
  }
  ```

---

#### 11. `DELETE /api/products/:id`
- **Description:** Delete a product by ID.
- **Request:**  
  No body required.
- **Response:**
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

---




# FinTech-API

## Overview
This project implements a RESTful API for a basic FinTech application. It allows users to register, login, and perform financial transactions.

## API Endpoints

### Register User
- **URL:** `/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "example_user",
    "password": "password"
  }
## Response

### Register User
- `201 Created`: User registered successfully
- `400 Bad Request`: User already exists

### Login User
- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "example_user",
    "password": "password"
  }
## Response

### Login User
- **200 OK:** Login successful (returns JWT token)
- **400 Bad Request:** User not found or invalid password

### Create Transaction
- **URL:** `/transactions`
- **Method:** `POST`
- **Authorization:** JWT token in the header
- **Request Body:**
  ```json
  {
    "amount": 1000,
    "description": "Payment for services"
  }

## Response

### Create Transaction
- **201 Created:** Transaction created successfully

### Get All Transactions
- **URL:** `/transactions`
- **Method:** `GET`
- **Authorization:** JWT token in the header
- **Response:** Array of transaction objects

### Get Transaction by ID
- **URL:** `/transactions/:id`
- **Method:** `GET`
- **Authorization:** JWT token in the header
- **Response:** Transaction object or `404 Not Found`

### Update Transaction
- **URL:** `/transactions/:id`
- **Method:** `PUT`
- **Authorization:** JWT token in the header
- **Request Body:** Updated transaction fields
- **Response:** Updated transaction object or `404 Not Found`

### Delete Transaction
- **URL:** `/transactions/:id`
- **Method:** `DELETE`
- **Authorization:** JWT token in the header
- **Response:**
  - **200 OK:** Transaction deleted successfully
  - **404 Not Found:** Transaction not found

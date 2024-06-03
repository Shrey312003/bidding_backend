# Bidding Backend

This is the backend of the bidding application where users can create items for auctions, place bids and receive real time notifications about bid updates. 

## Table of Contents

- [Bidding Backend](#bidding-backend)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Setup and Usage](#setup-and-usage)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [API Routes](#api-routes)
    - [Users](#users)
    - [Items](#items)
  - [Web Socket Events](#web-socket-events)
  - [Middleware](#middleware)
  - [Testing](#testing)


## Project Structure

```
bidding_backend/
├── .env
├── .gitignore
├── database.js
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── test.rest
├── middleware/
│ └── authenticationToken.js
├── src/
│ ├── items/
│ │ ├── controller.js
│ │ ├── queries.js
│ │ └── routes.js
│ ├── notifications/
│ │ ├── controller.js
│ │ ├── queries.js
│ │ └── routes.js
│ └── users/
│ ├── controller.js
│ ├── queries.js
│ └── routes.js
└── uploads/
└── [uploaded images]
```

## Setup and Usage

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd bidding_backend

2. Install dependencies:
   ```bash
   npm install

3. Set up the environment variables by creating a `.env` file in your root directory.
   ```env
   PORT=8000
    DATABASE_URL=<your_database_url>
    JWT_SECRET=<your_jwt_secret>

4. Start the server
   ```bash
   npm run start

### Database Setup

After installing go to database.js and update the database config accordingly.
Make tables in public schema. 
Run these SQL queries to make the tables:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    starting_price DECIMAL(10, 2) NOT NULL,
    current_price DECIMAL(10, 2) DEFAULT 0,
    image_url VARCHAR(255),
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```
## API Routes
### Users

- **POST /users/register**: Register a new user
  - Request Body:
    ```json
    {
        "username": "string",
        "password": "string"
    }
  - Response:
    ```json
    {
        "message": "User registered successfully"
    }

- **POST /users/login**: Log in a user
  - Request Body:
    ```json
    {
        "username": "string",
        "password": "string"
    }
  - Response:
    ```json
    {
        "token": "string",
        "message": "User logged in successfully"
    }

- **GET /users/profile**: Log in a user. Middleware authenticator used to check the tokens to get the user id. 
  - Request Headers:
    ```json
    {
        "Authorization": "Bearer + token" 
    }
  - Response:
    ```json
    [{
        "id":"number",
        "username":"string",
        "password":"hashed string",
        "email":"string",
        "role":"string",
        "created_at":"timestamp string"
    }]

### Items
- **POST /items**: Create a new item for bidding.
  - Request Headers:
    ```json
    {
        "Authentication" : "Bearer + token"
    }

  - Request Body:
    ```json
    {
        "name": "string",
        "starting_price": "number",
        "description": "string",
        "end_time": "datetime",
        "image_url": "string"
    }
  - Response:
    ```json
    {
        "id": "string",
        "name": "string",
        "starting_price": "number",
        "description": "string",
        "end_time": "datetime",
        "image_url": "string",
        "message": "Item created successfully"
    }

- **GET /items**: Get a list of items.
  - Response:
    ```json
    [
        {
            "id": "string",
            "name": "string",
            "starting_price": "number",
            "current_price": "number",
            "description": "string",
            "end_time": "datetime",
            "image_url": "string"
        }
    ]

- **GET /items/:id**: Get details of a specific item.
  
  - Response:
    ```json
    {
        "id": "string",
        "name": "string",
        "starting_price": "number",
        "current_price": "number",
        "description": "string",
        "end_time": "datetime",
        "image_url": "string"
    }
- **POST /items/:id/bids**: Place a bid on an item. 
  - Request Headers:
    ```json
    {
        "Authentication" : "Bearer + token"
    }

  - Request Body:
    ```json
    {
        "bid_amount": "number"
    }
  - Response:
    ```json 
    {
        "item_id": "string",
        "user_id": "string",
        "bid_amount": "number",
        "timestamp": "datetime",
        "message": "Bid placed successfully"
    }

- **GET /items/:id/bids**: Get bids of a specific item.
  
  - Response:
    ```json
    {
        "id": "string",
        "item_id":"string",
        "user_id":"string",
        "bid_amount":"number",
        "created_at":"datetime"
    }

- **PUT /items/:id**: Update the item.
  - Request Headers:
    ```json
    {
        "Authentication" : "Bearer + token"
    }

  - Request Body:
    ```json
    {
        "name": "string",
        "starting_price": "number",
        "description": "string",
        "end_time": "datetime",
        "image_url": "string"
    }
  - Response:
    ```json
    {
        "id": "string",
        "name": "string",
        "starting_price": "number",
        "description": "string",
        "end_time": "datetime",
        "image_url": "string",
        "message": "Item updated"
    }

- **DELETE /items/:id**: Delete the specific item.
  - Request Headers:
    ```json
    {
        "Authentication" : "Bearer + token"
    }
  
  - Response:
    ```json
    {
        "message":"deleted"
    }

- **POST /items/upload**: Upload an image.

  - Request Body: FormData with the image file.
   
  - Response:
    ```json
    {
        "imageUrl": "string",
        "message": "Image uploaded successfully"
    }

- **GET /notifications**: Get notifications of a particular user.
  - Request Headers:
    ```json
    {
        "Authentication" : "Bearer + token"
    }

   - Response:
    ```json
    [
        {
            "id": "string",
            "message": "string",
            "is_read": "boolean",
            "created_at": "datetime"
        }
    ]

- **POST /notifications/mark-read/:id**: Mark notification to be read.
  - Request Headers:
    ```json
    {
        "Authentication" : "Bearer + token"
    }

  
  - Response:
    ```json
    {
        "message": "Marked"
    }

## Web Socket Events
- connection: Establish a new websocket connection.
- bid: Place a new bid on an item
  - Payload:
    ```json
    {
        "bid_amount": "number",
        "token": "string"
    }
- bid2: Create notifications for different type of users and store in database.
  - Payload:
    ```json
    {
        "bid_amount": "number",
        "token": "string"
    }
**NOTE-** The event is same as bid but here I am creating notifications. I could have done it in bid itself but the event was getting too big in backend so for ease in coding I made two events. 

- notify: I have not created a separate socket event to notify users as the notifications are stored in real time in bid2 also it was tough to emit different notifications to different users using this event. 

## Middleware
**Authentication token** : A middleware is created to verify the JWT tokens and update the request user to the logged in user.

## Testing

Mocha and chai are used to test some of the major routes. As the routes are also checked in frontend only the major routes were checked using mocha. I have created three test files.
All the tests were passing. 
# User Endpoints Documentation

## 1. Get User by ID
### `GET /users/:id`

Retrieve a user’s details by their unique ID.

### Request Parameters:
- `id` (required): The unique ID of the user.

### Response:
- **Status 200**: Successfully retrieved the user.
  - `data`: A JSON object containing user details (excluding password).
- **Status 500**: Internal server error, failed to retrieve the user.

### Example Request:
```http
GET /users/123
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}
```

## 2. Create a User
### `POST /users`

Creates a new user with the provided details.

### Request Body:
- `name` (required): The user's name.
- `email` (required): The user's email address.
- `password` (required): The user's password.

### Response:
- **Status 201**: Successfully created the user.
  - `data`: A JSON object containing the created user's details.
- **Status 400**: Bad request, validation errors.
- **Status 500**: Internal server error, failed to create the user.

### Example Request:
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "myPassword123"
}
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "johndoe@example.com", 
  }
}
```

## 3. Delete a User
### `DELETE /users/:id`

Deletes a user with the specified ID.

### Request Parameters:
- `id` (required): The unique ID of the user.

### Response:
- **Status 200**: Successfully deleted the user.
  - `data`: A JSON object containing the deleted user's details.
- **Status 400**: Bad request, validation errors.
- **Status 500**: Internal server error, failed to delete the user.

### Example Request:    
```http
DELETE /users/123
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "johndoe@example.com", 
  }
}
```

# Tasks Endpoints

## 1. Get All Tasks
### `GET /tasks`

Retrieves all tasks in the system.

### Response:
- **Status 200**: Successfully retrieved all tasks.
  - `data`: An array of JSON objects containing task details.
- **Status 500**: Internal server error, failed to retrieve all tasks.

### Example Request:
```http
GET /tasks
```

### Example Response:
```json
{
  "data": [
    {
      "id": "123",
      "name": "Task 1",
      "status": "processing",
      "userId": "123"
    },
    {
      "id": "456",
      "name": "Task 2",
      "status": "completed",
      "userId": "123"
    }
  ]
}
```

## 2. Create a Task
### `POST /tasks`

Creates a new task for the authenticated user.

### Request Body:
- `name` (required): The task's name.

### Response:
- **Status 201**: Successfully created the task.
  - `data`: A JSON object containing the created task's details.
- **Status 400**: Bad request, validation errors.
- **Status 500**: Internal server error, failed to create the task.

### Example Request:
```http
POST /tasks
Content-Type: application/json

{
  "name": "Task 1"
}
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "Task 1",
    "status": "processing",
    "userId": "123"
  }
}
```

## 3. Update a Task
### `PUT /tasks/:id`

Updates an existing task with the provided details.

### Request Parameters:
- `id` (required): The unique ID of the task.

### Request Body:
- `name` (optional): The updated task's name.
- `status` (optional): The updated task's status.

### Response:
- **Status 200**: Successfully updated the task.
  - `data`: A JSON object containing the updated task's details.
- **Status 400**: Bad request, validation errors.
- **Status 403**: Forbidden, the user is not authorized to update the task.
- **Status 500**: Internal server error, failed to update the task.

### Example Request:
```http
PUT /tasks/123
Content-Type: application/json

{
  "name": "Updated Task Name",
  "status": "completed"
}
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "Updated Task Name",
    "status": "completed",
    "userId": "123"
  }
}
```

## 4. Delete a Task
### `DELETE /tasks/:id`

Deletes a task with the specified ID.

### Request Parameters:
- `id` (required): The unique ID of the task.

### Response:
- **Status 204**: Successfully deleted the task.
  - `data`: A JSON object containing the deleted task's details.
- **Status 400**: Bad request, validation errors.
- **Status 403**: Forbidden, the user is not authorized to delete the task.
- **Status 500**: Internal server error, failed to delete the task.

### Example Request:
```http
DELETE /tasks/123
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "Updated Task Name",
    "status": "completed",
    "userId": "123"
  }
}        
```

# Authentication Endpoints

## 1. Login
### `POST /auth/login`

Logs in a user with the provided credentials.

### Request Body:
- `email` (required): The user's email address.
- `password` (required): The user's password.

### Response:
- **Status 200**: Successfully logged in the user.
  - `data`: A JSON object containing the user's details.
- **Status 400**: Bad request, validation errors.
- **Status 500**: Internal server error, failed to log in the user. 

### Example Request:
```http
POST /auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}        
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "password": "$2b$10$5.8/8.4"
    }
}
```

## 2. Logout
### `POST /auth/logout`

Logs out the currently logged-in user.

### Response:
- **Status 200**: Successfully logged out the user.
- **Status 500**: Internal server error, failed to log out the user.

### Example Request:
```http
POST /auth/logout
```

### Example Response:
```json
{
  "message": "Logout successful"
}
```

## 3. Get Current User
### `GET /auth/me`

Retrieves the currently logged-in user's details.

### Response:
- **Status 200**: Successfully retrieved the user.
  - `data`: A JSON object containing the user's details.
- **Status 401**: Unauthorized, the user is not logged in.
- **Status 500**: Internal server error, failed to retrieve the user.

### Example Request:
```http
GET /auth/me
```

### Example Response:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "password": "$2b$10$5.8/8"
    }
}   
```


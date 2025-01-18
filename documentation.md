Job Board API Documentation
This document outlines the API routes for the Job Board backend application. It includes endpoints, descriptions, required inputs, and expected responses.

Base URL
Development: http://localhost:5000/api
Authentication

1. User Login
   POST /auth/login
   Authenticates a user and provides a JWT token.

Request Body:
json
Copy code
{
"email": "user@example.com",
"password": "password123"
}
Response:
json
Copy code
{
"success": true,
"token": "your-jwt-token"
} 2. User Logout
GET /auth/logout
Logs out the user and clears cookies.

Response:
json
Copy code
{
"success": true,
"message": "Logged out successfully"
}
Users

1. Get User Profile
   GET /users/profile
   Fetches the profile of the authenticated user.

Headers:
Authorization: Bearer <JWT_TOKEN>
Response:
json
Copy code
{
"success": true,
"data": {
"id": "user_id",
"name": "John Doe",
"email": "john@example.com",
"role": "user"
}
} 2. Update User Profile
PUT /users/profile
Updates the authenticated user’s profile.

Headers:
Authorization: Bearer <JWT_TOKEN>
Request Body:
json
Copy code
{
"name": "Updated Name",
"email": "updated@example.com"
}
Response:
json
Copy code
{
"success": true,
"data": {
"id": "user_id",
"name": "Updated Name",
"email": "updated@example.com"
}
} 3. Delete User
DELETE /users/:id
Deletes a user by ID (Admin-only).

Headers:
Authorization: Bearer <JWT_TOKEN>
Response:
json
Copy code
{
"success": true,
"message": "User deleted successfully"
}
Jobs

1. Get All Jobs
   GET /jobs
   Retrieves a list of all jobs.

Response:
json
Copy code
{
"success": true,
"data": [
{
"id": "job_id",
"title": "Software Engineer",
"company": "Company Name",
"description": "Job description",
"location": "City, Country",
"postedBy": "user_id"
}
]
} 2. Get Job by ID
GET /jobs/:id
Fetches details of a specific job.

Response:
json
Copy code
{
"success": true,
"data": {
"id": "job_id",
"title": "Software Engineer",
"company": "Company Name",
"description": "Job description",
"location": "City, Country",
"postedBy": "user_id"
}
} 3. Create a Job
POST /jobs
Creates a new job (Authenticated users).

Headers:
Authorization: Bearer <JWT_TOKEN>
Request Body:
json
Copy code
{
"title": "Software Engineer",
"company": "Company Name",
"description": "Job description",
"location": "City, Country"
}
Response:
json
Copy code
{
"success": true,
"data": {
"id": "job_id",
"title": "Software Engineer",
"company": "Company Name",
"description": "Job description",
"location": "City, Country",
"postedBy": "user_id"
}
} 4. Update a Job
PUT /jobs/:id
Updates a job by ID (Authenticated users).

Headers:
Authorization: Bearer <JWT_TOKEN>
Request Body:
json
Copy code
{
"title": "Updated Job Title",
"description": "Updated description"
}
Response:
json
Copy code
{
"success": true,
"data": {
"id": "job_id",
"title": "Updated Job Title",
"description": "Updated description"
}
} 5. Delete a Job
DELETE /jobs/:id
Deletes a job by ID (Admin-only).

Headers:
Authorization: Bearer <JWT_TOKEN>
Response:
json
Copy code
{
"success": true,
"message": "Job deleted successfully"
}
Comments

1. Add a Comment
   POST /comments
   Adds a comment to a job posting (Authenticated users).

Headers:
Authorization: Bearer <JWT_TOKEN>
Request Body:
json
Copy code
{
"jobId": "job_id",
"content": "This is a comment"
}
Response:
json
Copy code
{
"success": true,
"data": {
"id": "comment_id",
"content": "This is a comment",
"postedBy": "user_id",
"jobId": "job_id"
}
} 2. Get Comments for a Job
GET /comments/:jobId
Retrieves all comments for a specific job.

Response:
json
Copy code
{
"success": true,
"data": [
{
"id": "comment_id",
"content": "This is a comment",
"postedBy": "user_id",
"jobId": "job_id"
}
]
} 3. Delete a Comment
DELETE /comments/:id
Deletes a specific comment (Authenticated users).

Headers:
Authorization: Bearer <JWT_TOKEN>
Response:
json
Copy code
{
"success": true,
"message": "Comment deleted successfully"
}
Other Routes
Likes
POST /likes - Add a like to a job.
GET /likes/:jobId - Get all likes for a job.
Ratings
POST /ratings - Add a rating to a job.
GET /ratings/:jobId - Get all ratings for a job.
Reviews
POST /reviews - Add a review to a job.
GET /reviews/:jobId - Get all reviews for a job

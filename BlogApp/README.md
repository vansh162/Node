# BlogApp - A Modern Blogging Platform

A full-featured blogging application built with Node.js, Express, MongoDB, and EJS templates. Features user authentication with cookies, CRUD operations for blog posts, comments, likes, and a responsive design.

## Features

- **User Authentication**: Register, login, and logout with JWT tokens stored in cookies
- **Blog Management**: Create, read, update, and delete blog posts
- **User Dashboard**: Manage your posts and view statistics
- **Comments System**: Leave comments on blog posts
- **Like System**: Like and unlike posts
- **Responsive Design**: Modern UI with Bootstrap 5
- **Pagination**: Browse posts with pagination
- **Tags**: Categorize posts with tags
- **View Tracking**: Track post views
- **Draft System**: Save posts as drafts

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with cookie storage
- **Frontend**: EJS templates, Bootstrap 5, Font Awesome
- **Password Hashing**: bcryptjs
- **Development**: nodemon for auto-restart

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `blog_app`
   - Update the connection string in `app.js` if needed

4. **Environment Variables (Optional)**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blog_app
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. **Start the application**
   ```bash
   npm run server
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
blog-app/
├── models/
│   ├── User.js          # User model with authentication
│   └── Post.js          # Blog post model
├── routes/
│   ├── index.js         # Main routes (home, dashboard)
│   ├── auth.js          # Authentication routes
│   └── blog.js          # Blog post routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── views/
│   ├── layouts/
│   │   └── main.ejs     # Main layout template
│   ├── auth/
│   │   ├── login.ejs    # Login form
│   │   └── register.ejs # Registration form
│   ├── blog/
│   │   ├── index.ejs    # Blog posts list
│   │   ├── create.ejs   # Create post form
│   │   ├── show.ejs     # Single post view
│   │   └── edit.ejs     # Edit post form
│   ├── index.ejs        # Home page
│   ├── dashboard.ejs    # User dashboard
│   ├── about.ejs        # About page
│   ├── contact.ejs      # Contact page
│   └── error.ejs        # Error page
├── public/
│   └── images/          # Static images
├── app.js               # Main application file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## API Endpoints

### Authentication
- `GET /auth/register` - Registration form
- `POST /auth/register` - Create new account
- `GET /auth/login` - Login form
- `POST /auth/login` - Authenticate user
- `GET /auth/logout` - Logout user

### Blog Posts
- `GET /blog` - List all published posts
- `GET /blog/:id` - View single post
- `GET /blog/create` - Create post form (auth required)
- `POST /blog` - Create new post (auth required)
- `GET /blog/:id/edit` - Edit post form (auth + ownership required)
- `PUT /blog/:id` - Update post (auth + ownership required)
- `DELETE /blog/:id` - Delete post (auth + ownership required)

### Comments
- `POST /blog/:id/comments` - Add comment (auth required)

### Likes
- `POST /blog/:id/like` - Toggle like (auth required)

### User Dashboard
- `GET /dashboard` - User dashboard (auth required)

## Database Models

### User Model
- `username` (unique, required)
- `email` (unique, required)
- `password` (hashed, required)
- `avatar` (default image)
- `bio` (optional)
- `isAdmin` (boolean, default false)
- `timestamps`

### Post Model
- `title` (required)
- `content` (required)
- `excerpt` (auto-generated)
- `author` (reference to User)
- `tags` (array)
- `featuredImage` (default image)
- `status` (published/draft)
- `views` (counter)
- `likes` (array of user references)
- `comments` (array of comment objects)
- `timestamps`

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies for token storage
- Input validation and sanitization
- CSRF protection (via form tokens)
- Secure headers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

## Future Enhancements

- Image upload functionality
- Rich text editor
- Email notifications
- Social media sharing
- Search functionality
- User profiles
- Admin panel
- API endpoints for mobile apps
- Email verification
- Password reset functionality 
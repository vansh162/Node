# BlogHub - Multi-User Blog Platform

A modern, feature-rich blog platform built with Node.js, Express, MongoDB, and JWT authentication.

## Features

### 🔐 Authentication & Security
- **JWT Token Authentication** with secure cookie storage
- **Role-based Access Control** (Admin/User roles)
- **Password Hashing** using bcryptjs
- **Secure Session Management**

### 📝 Blog Management
- **Multi-user Support** - Each user can create their own articles
- **CRUD Operations** - Create, Read, Update, Delete articles
- **User-specific Articles** - View and manage your own articles
- **Article Tags** - Categorize articles with tags
- **Rich Content** - Full-text article content with formatting

### 💬 Comments System
- **Article Comments** - Users can comment on articles
- **Comment Management** - Edit/delete your own comments
- **Admin Privileges** - Admins can delete any comment

### 🎨 Modern UI/UX
- **Responsive Design** - Works on all device sizes
- **Stylish Theme** - Modern gradient design with glassmorphism effects
- **Interactive Elements** - Hover effects and smooth transitions
- **User-friendly Navigation** - Intuitive navbar with user status

### 🗄️ Database Features
- **MongoDB Integration** with Mongoose ODM
- **Data Population** - Efficient loading of related data
- **Schema Validation** - Robust data validation
- **Indexing** for optimal performance

## Project Structure

```
BlogProject2/
├── models/
│   ├── User.js          # User model with role-based access
│   ├── Article.js       # Article model with author reference
│   └── Comment.js       # Comment model with user/article refs
├── routes/
│   ├── auth.js          # Authentication routes (login/register)
│   ├── articles.js      # Article CRUD operations
│   └── comments.js      # Comment management
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── views/
│   ├── partials/
│   │   └── navbar.ejs   # Navigation component
│   ├── layout.ejs       # Main layout with CSS
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
│   ├── articleList.ejs  # All articles listing
│   ├── myArticles.ejs   # User's articles
│   ├── articleForm.ejs  # Create/edit article form
│   ├── articleItem.ejs  # Individual article view
│   └── error.ejs        # Error page
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### 1. Clone and Install
```bash
git clone <repository-url>
cd BlogProject2
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog_project
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Database Setup
Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB instance.

### 4. Start the Application
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### For Users
1. **Register** - Create a new account
2. **Login** - Access your account
3. **Browse Articles** - View all published articles
4. **Write Articles** - Create your own blog posts
5. **Manage Articles** - Edit or delete your articles
6. **Comment** - Leave comments on articles

### For Admins
- All user privileges
- Can delete any article or comment
- Full system access

## API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Login handler
- `GET /auth/register` - Registration page
- `POST /auth/register` - Registration handler
- `GET /auth/logout` - Logout

### Articles
- `GET /articles` - All articles
- `GET /articles/my-articles` - User's articles
- `GET /articles/new` - Create article form
- `POST /articles` - Create article
- `GET /articles/:id` - View article
- `GET /articles/:id/edit` - Edit article form
- `POST /articles/:id` - Update article
- `POST /articles/:id/delete` - Delete article

### Comments
- `POST /comments/:articleId` - Add comment
- `POST /comments/:commentId/delete` - Delete comment

## Security Features

- **JWT Tokens** stored in HTTP-only cookies
- **Password Hashing** with bcryptjs
- **Input Validation** on all forms
- **CSRF Protection** through proper form handling
- **Role-based Authorization** for sensitive operations
- **Secure Headers** and cookie settings

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Template Engine**: EJS
- **Styling**: Custom CSS with modern design
- **Development**: Nodemon for hot reloading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 
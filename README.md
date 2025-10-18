# TaskMate - Project & Task Management System

A comprehensive project and task management system built with the MERN stack, featuring AI-powered assistance using Gemini AI for task summarization and intelligent Q&A capabilities.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Full CRUD operations for tasks within projects
- **Kanban Board**: Interactive drag-and-drop interface with three columns (To Do, In Progress, Done)
- **User Authentication**: Secure login/logout with JWT tokens

### AI-Powered Features
- **Task Summarization**: Generate AI-powered summaries of all tasks in a project
- **Intelligent Q&A**: Ask questions about specific tasks and get AI responses
- **Project Insights**: AI analysis of project progress and recommendations

### Technical Features
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: All data stored securely in MongoDB
- **RESTful API**: Clean API architecture following REST principles

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Gemini AI** - AI integration for task analysis

### Frontend
- **React.js** - User interface library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Framer Motion** - Animations

## 📁 Project Structure

```
taskmate/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── db/              # Database connection
│   ├── app.js               # Express app configuration
│   ├── index.js             # Server entry point
│   └── package.json
└── client/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── redux/           # State management
    │   ├── utils/           # Utility functions
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskmate
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**

   **Backend** (`backend/.env`):
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=taskmate
   CORS_ORIGIN=http://localhost:5173
   
   ACCESS_TOKEN_SECRET=your-access-token-secret-key-here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-here
   REFRESH_TOKEN_EXPIRY=10d
   
   GEMINI_API_KEY=your-gemini-api-key-here
   
   NODE_ENV=development
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user

### Project Endpoints
- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get specific project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Task Endpoints
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:projectId` - Get tasks by project
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `PUT /api/v1/tasks/:id/move` - Move task between columns

### AI Endpoints
- `POST /api/v1/ai/summarize` - Generate project summary
- `POST /api/v1/ai/ask` - Ask questions about tasks

## 🎯 Usage

1. **Registration/Login**: Create an account or sign in
2. **Create Project**: Start by creating a new project with name and description
3. **Add Tasks**: Create tasks within your project using the "Add Task" button
4. **Organize Tasks**: Drag and drop tasks between To Do, In Progress, and Done columns
5. **AI Assistant**: Use the AI assistant to:
   - Generate project summaries
   - Ask questions about specific tasks
   - Get insights and recommendations

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon
```

### Frontend Development
```bash
cd client
npm run dev  # Starts Vite development server
```

### Build for Production
```bash
cd client
npm run build  # Creates production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built following modern MERN stack practices
- UI/UX inspired by popular project management tools
- AI integration powered by Google's Gemini AI
- Icons provided by Lucide React

## 📞 Support

If you have any questions or run into issues, please:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

**Happy Project Managing! 🎉**
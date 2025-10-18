# TaskMate Backend Deployment Guide

## 🚀 Deploying to Render

### Prerequisites
- GitHub repository with backend code
- Render account (free tier available)
- MongoDB Atlas account (for database)

### Step 1: Environment Variables Setup

In your Render service dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net
DB_NAME=taskmate
ACCESS_TOKEN_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGIN=*
```

### Step 2: Render Service Configuration

1. **Connect Repository**: 
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder as root directory

2. **Service Settings**:
   ```
   Name: taskmate-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend (if deploying from subfolder)
   Build Command: npm install
   Start Command: npm start
   ```

3. **Plan**: Choose Free tier for development

### Step 3: Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create new cluster (free tier available)
3. Add your IP to whitelist (0.0.0.0/0 for all IPs)
4. Create database user
5. Get connection string and add to MONGO_URI env var

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Run `npm install`
   - Start the server with `npm start`
   - Assign a public URL

### Step 5: Test Deployment

Your API will be available at: `https://your-service-name.onrender.com`

Test endpoints:
- `GET /` - Health check
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login

### Common Issues & Solutions

#### Build Fails with "npm" error
- Ensure `package.json` has proper `start` script
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`

#### Database Connection Error
- Check MONGO_URI format
- Ensure IP whitelist includes 0.0.0.0/0
- Verify database user permissions

#### Environment Variables Missing
- Add all required env vars in Render dashboard
- Restart service after adding env vars

#### CORS Issues
- Set CORS_ORIGIN to your frontend domain
- Or use "*" for development

### Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, memory usage tracking
- **Health Checks**: Automatic service monitoring

### Auto-Deploy

- Render automatically deploys on git push to main branch
- Configure branch in service settings
- Use webhooks for custom deployment triggers

### Production Checklist

- ✅ Environment variables set
- ✅ Database connection working
- ✅ CORS configured for frontend domain
- ✅ Error handling implemented
- ✅ Logging configured
- ✅ Health check endpoint working

### URLs

- **Backend API**: `https://your-service-name.onrender.com`
- **Health Check**: `https://your-service-name.onrender.com/`
- **API Docs**: `https://your-service-name.onrender.com/api/v1`

### Support

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- GitHub Issues: Report bugs in repository
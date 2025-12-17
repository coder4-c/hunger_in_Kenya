# Hunger in Kenya - MERN Stack Application

A comprehensive MERN (MongoDB, Express.js, React.js, Node.js) stack application dedicated to addressing the hunger crisis in Kenya through sustainable solutions, emergency relief, and community empowerment.

## 🏗️ Project Structure

```
hunger-in-kenya/
├── BACKEND/                 # Express.js API Server
│   ├── config/             # Database configuration
│   ├── models/             # Mongoose schemas
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── FRONTEND/               # React.js Application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # React page components
│   │   ├── services/       # API service functions
│   │   └── ...
│   ├── package.json        # Frontend dependencies
│   └── .env                # Environment variables
└── README.md               # This file
```

## 🚀 Technologies Used

### Backend (Node.js + Express.js)
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Express Validator** - Input validation
- **Express Rate Limit** - Rate limiting

### Frontend (React.js)
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **React Helmet** - Document head management
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

### Database (MongoDB)
- **MongoDB Atlas** - Cloud database (recommended)
- **Local MongoDB** - For development

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### MongoDB Atlas Setup (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button
6. Update the `MONGODB_URI` in `BACKEND/.env` with your Atlas connection string

### Local MongoDB Setup (Alternative)
If you prefer local MongoDB:
1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use the default `MONGODB_URI=mongodb://localhost:27017/hunger_in_kenya` in `.env`

### Backend Setup
1. Navigate to backend directory:
```bash
cd BACKEND
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3001
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/hunger_in_kenya?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd FRONTEND
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NODE_ENV=development
```

4. Start the React development server:
```bash
npm start
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Data Retrieval
- `GET /api/donations/current` - Current donation statistics
- `GET /api/impact/statistics` - Impact metrics
- `GET /api/programs/locations` - Program locations

### Data Submission
- `POST /api/contact` - Contact form submission
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/volunteer` - Volunteer application
- `POST /api/donation` - Donation processing

## 🎨 Features

### Current Implementation
- ✅ Responsive React.js frontend
- ✅ Express.js API server
- ✅ MongoDB integration with Mongoose
- ✅ Real-time donation tracking
- ✅ Newsletter subscription
- ✅ Contact form handling
- ✅ Volunteer applications
- ✅ Mobile-responsive design
- ✅ Security middleware
- ✅ Input validation
- ✅ Error handling

### Planned Features
- 🔄 Payment gateway integration
- 🔄 User authentication
- 🔄 Admin dashboard
- 🔄 Interactive map
- 🔄 Advanced analytics
- 🔄 Email notifications
- 🔄 File uploads

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - API request limiting
- **Input Validation** - Data sanitization
- **Error Handling** - Secure error responses

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (up to 767px)

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd BACKEND
npm test

# Frontend tests
cd FRONTEND
npm test
```

### Code Structure

#### Backend Models
- **Donation.js** - Donation tracking and processing
- **Contact.js** - Contact form submissions
- **Volunteer.js** - Volunteer applications
- **Newsletter.js** - Newsletter subscriptions

#### Frontend Components
- **Navigation.js** - Main navigation component
- **Footer.js** - Site footer
- **NewsletterForm.js** - Newsletter subscription form

#### Frontend Pages
- **Home.js** - Landing page with all sections
- **About.js** - About the crisis
- **Solutions.js** - Our solutions
- **HowToHelp.js** - How to help
- **ImpactStories.js** - Impact stories
- **GetInvolved.js** - Get involved
- **Donation.js** - Donation page
- **InteractiveMap.js** - Interactive map
- **Contact.js** - Contact page

## 🌐 Deployment

### Backend Deployment (Heroku example)
1. Create Heroku app
2. Set environment variables
3. Deploy from Git repository

### Frontend Deployment (Netlify/Vercel example)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Set environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email info@hungerinkenya.org or create an issue in the repository.

---

**Together We Can End Hunger in Kenya** 🇰🇪
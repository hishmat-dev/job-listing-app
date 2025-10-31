# Actuarial Job Listings - Full Stack Application

A comprehensive job listing web application built with Flask (Python) backend, React frontend, and Selenium web scraping capabilities. Designed specifically for actuarial job postings with advanced filtering, sorting, and CRUD operations.

## 🚀 Features

### Backend (Flask API)
- **RESTful API** with full CRUD operations
- **SQLAlchemy ORM** with PostgreSQL/MySQL support
- **Advanced filtering & sorting** by job type, location, tags, date ranges
- **Input validation** and comprehensive error handling
- **Database migrations** and seeding capabilities
- **CORS support** for frontend integration

### Frontend (React)
- **Modern React** with hooks and functional components
- **Responsive design** with mobile-first approach
- **Advanced filtering** with collapsible filter panels
- **Real-time search** and dynamic sorting
- **CRUD operations** with form validation
- **Toast notifications** and error boundaries
- **Job statistics** dashboard
- **Professional dark theme** UI

### Web Scraping (Selenium)
- **Automated scraping** from ActuaryList.com
- **Intelligent data extraction** with duplicate prevention
- **Robust error handling** and retry mechanisms
- **Database integration** with automatic job insertion
- **Configurable scraping limits** and scheduling

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL or MySQL database
- Chrome browser (for scraping)
- ChromeDriver (for Selenium)

### Backend Setup

1. **Navigate to backend directory**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Set up database**

   - Create database in PostgreSQL/MySQL
   - Update DATABASE_URL in .env file
   

3. **Run the application**
   \`\`\`bash
   python app.py
   \`\`\`

The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm start
   \`\`\`

The application will be available at `http://localhost:3000`

### Scraper Setup

1. **Navigate to scraper directory**
   \`\`\`bash
   cd scraper
   \`\`\`

3. **Run scraper**
   \`\`\`bash
   ./python scrape.py
   # Or directly: python run_scraper.py
   \`\`\`

## 🔧 API Endpoints

### Jobs
- `GET /api/jobs` - List all jobs with filtering/sorting
- `GET /api/jobs/<id>` - Get specific job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/<id>` - Update job
- `DELETE /api/jobs/<id>` - Delete job
- `GET /api/jobs/stats` - Get job statistics

### Query Parameters
- `search` - Search in title, company, location
- `job_type` - Filter by job type
- `location` - Filter by location
- `city` - Filter by city
- `country` - Filter by country
- `tag` - Filter by tag
- `sort` - Sort by various fields
- `page` - Pagination page number
- `per_page` - Items per page

## 🎨 UI Features

### User Experience
- **Real-time filtering** without page reloads
- **Advanced search** across multiple fields
- **Collapsible filter panels** to save space
- **Active filter indicators** with individual clear options
- **Loading states** and error boundaries
- **Toast notifications** for user feedback
- **Confirmation dialogs** for destructive actions

## 🔍 Scraping Details

### Data Extracted
- Job title and company name
- Location (city, country)
- Posting date (with relative date parsing)
- Job type (Full-Time, Part-Time, Contract, Internship)
- Salary information (when available)
- Relevant tags (Life, Health, Pricing, Python, etc.)

### Features
- **Duplicate prevention** based on title + company
- **Intelligent date parsing** from relative formats
- **Tag extraction** from job descriptions
- **Error handling** for missing or malformed data
- **Configurable limits** to prevent overloading

## 🚦 Error Handling

### Backend
- **Input validation** with detailed error messages
- **Database error handling** with rollback
- **HTTP status codes** following REST conventions
- **Logging** for debugging and monitoring

### Frontend
- **Error boundaries** to catch React errors
- **API error handling** with user-friendly messages
- **Form validation** with real-time feedback
- **Network error detection** and retry mechanisms
- **Loading states** for better UX

## 🧪 Testing

### API Testing
Use tools like Postman or curl to test API endpoints:

\`\`\`bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Create a job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","company":"Test Company","location":"Test Location"}'
\`\`\`

## 📈 Performance Considerations

### Backend
- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching for expensive queries
- Connection pooling

### Frontend
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

## 🔒 Security

### Backend
- Input sanitization and validation
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration
- Environment variable protection

### Frontend
- XSS prevention
- Secure API communication
- Input validation
- Error message sanitization


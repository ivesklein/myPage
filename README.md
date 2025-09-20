# myPage

A lightweight personal website that uses Markdown files as a data source, providing a simple and maintainable approach to content management.

## Live Site
- **Production**: https://ivesklein.cl/

## Features
- Markdown-driven content management
- Lightweight and fast loading
- Easy content updates without database dependencies
- Responsive design

## Architecture

### Frontend
- **Build Tool**: Webpack 5 with multi-entry configuration
- **Markdown Processing**: Marked.js for real-time MD to HTML conversion
- **Routing**: Hash-based SPA routing with dynamic content loading
- **Bundling**: Separate bundles for render, editor, and login functionality
- **Environment**: Environment variables injected via Webpack DefinePlugin

### Backend
- **Runtime**: AWS Lambda (Node.js ES modules)
- **Database**: Amazon DynamoDB with Dynamoose ODM
- **Storage**: Amazon S3 for static content and file storage
- **Authentication**: JWT-based authentication system
- **Validation**: Yup schema validation
- **Testing**: Jest testing framework

### Infrastructure
- **Hosting**: Amazon S3 static website hosting
- **CDN**: Amazon CloudFront for global content delivery
- **CI/CD**: GitHub Actions for automated deployment
- **API**: RESTful API with Lambda functions for CRUD operations

## Getting Started

### Prerequisites
- Node.js 20+
- AWS CLI (for backend deployment)
- Git

### Frontend Setup
```bash
cd front
npm install

# Development build with watch mode
npm run watch

# Production build
npm run prod
```

### Backend Setup
```bash
cd back
npm install

# Run tests
npm test

# Configure environment variables
cp .env.example .env
# Edit .env with your AWS credentials and endpoints
```

### Environment Variables
**Frontend (.env)**:
```
API_ENDPOINT=https://your-api-gateway-url
DOCS_ENDPOINT=https://your-s3-bucket-url
FILES_ENDPOINT=https://your-files-bucket-url
```

**Backend (.env)**:
```
AWS_REGION=us-east-1
DYNAMO_TABLE_NAME=your-table-name
JWT_SECRET=your-jwt-secret
```

## Content Management

### Dual Content Strategy
1. **S3 Static Files**: Direct `.md` files served from S3 for public content
2. **DynamoDB Storage**: Dynamic content with CRUD operations via API

### Content Features
- Hash-based routing (`#page-name` or `#section-subsection`)
- Real-time Markdown rendering with Marked.js
- Automatic external link handling (opens in new tab)
- Dynamic page titles from first heading
- Breadcrumb navigation for nested routes

### API Endpoints
- `GET /page/{pageId}` - Retrieve page content
- `POST /page` - Create new page (authenticated)
- `PUT /page/{pageId}` - Update page (authenticated)
- `DELETE /page/{pageId}` - Delete page (authenticated)
- `POST /login` - User authentication

## Project Structure
```
├── front/                 # Frontend application
│   ├── src/
│   │   ├── render.js      # Main SPA routing and rendering
│   │   ├── editor.js      # Content editor functionality
│   │   └── login.js       # Authentication handling
│   ├── webpack.config.js   # Build configuration
│   └── package.json
├── back/                  # Backend Lambda functions
│   ├── lib/               # Shared libraries
│   │   ├── storage-dynamo/    # DynamoDB operations
│   │   ├── storage-s3/        # S3 operations
│   │   └── jwt/               # JWT utilities
│   ├── pages/             # Page CRUD operations
│   ├── login/             # Authentication endpoints
│   └── package.json
└── .github/workflows/     # CI/CD pipeline
```

## Deployment

### Automated Deployment
To deploy changes:
1. Make your changes to the content or code
2. Create a pull request into the `deploy` branch
3. Once merged, GitHub Actions will:
   - Build the frontend with Webpack
   - Deploy static assets to S3
   - Invalidate CloudFront cache

### Manual Deployment
```bash
# Frontend only
cd front
npm run prod
aws s3 sync dist/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"

# Backend (requires AWS SAM or Serverless Framework)
cd back
# Deploy Lambda functions via your preferred method
```
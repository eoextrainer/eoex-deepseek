# EOEX Platform

A multi-tiered subscription-based community platform with Netflix-style UI for users, Salesforce-style admin interfaces, and Disney+ inspired workspace design.

## Overview

EOEX Platform is a comprehensive, scalable SaaS solution designed to support communities with different user tiers, subscription models, and real-time communication capabilities.

## Features

### Core Features
- **Multi-tier User System**: System Admin, Community Admin, Moderators, Users, and Guests
- **Subscription Management**: Flexible subscription plans with tier-based access
- **Q&A Community Forum**: Category-based organization with voting and best answer marking
- **Real-time Chat**: WebSocket-based peer communication
- **Theme System**: 5 pre-defined themes with custom creation capability
- **Multi-language Support**: Complete European language coverage with RTL support
- **Role-Based Access Control**: Comprehensive permission system

### User Tiers

1. **System Admin**
   - Dashboard with system performance metrics
   - User management across all tiers
   - Microservices management
   - AI prompt collection
   - Guest account approval

2. **Community Admin**
   - Community dashboard with analytics
   - Subscription management
   - Marketing campaigns
   - Feature request vetting

3. **Community Moderator**
   - Highlights dashboard
   - Opportunity tracking
   - Issue management
   - Forum moderation

4. **Community User**
   - Personalized content
   - Subscription modules
   - Q&A participation
   - Peer communication

5. **Community Guest**
   - Limited feature preview
   - Time-restricted access
   - Conversion funnel support

## Technical Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT with OAuth2
- **Real-time**: WebSockets
- **Testing**: Pytest

### Frontend
- **Framework**: React/Vue.js SPA
- **3D Graphics**: WebGL/Three.js
- **Styling**: Modern CSS/Tailwind
- **Testing**: Jest/Cypress

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: ELK Stack / Grafana

## Project Structure

```
eoex-deepseek/
├── backend/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── core/             # Configuration and security
│   │   ├── db/               # Database session and connections
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas for validation
│   │   ├── services/         # Business logic
│   │   ├── tests/            # Test suite
│   │   ├── ws/               # WebSocket handlers
│   │   └── main.py           # Application entry point
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React/Vue application
├── docker/                    # Additional docker configs
├── docker-compose.yml         # Container orchestration
├── .github/workflows/         # CI/CD pipelines
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (for containerized setup)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/eoextrainer/eoex-deepseek.git
cd eoex-deepseek
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Set up frontend**
```bash
cd frontend
npm install
```

### Running the Application

#### Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

The application will be available at:
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs

#### Local Development

**Backend**
```bash
cd backend
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python -m uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm start
```

## Testing

### Backend Tests
```bash
cd backend
pytest app/tests/ -v
pytest app/tests/ -v --cov=app  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:e2e  # End-to-end tests
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

#### Users
- `GET /api/v1/users` - List users
- `GET /api/v1/users/{user_id}` - Get user details
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

#### Subscriptions
- `GET /api/v1/subscriptions/plans` - List subscription plans
- `POST /api/v1/subscriptions` - Create subscription
- `GET /api/v1/subscriptions/user/{user_id}` - Get user subscriptions

#### Communities
- `GET /api/v1/communities` - List communities
- `POST /api/v1/communities` - Create community
- `GET /api/v1/communities/{community_id}/questions` - Forum questions
- `POST /api/v1/communities/{community_id}/questions` - Post question

## Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=eoex_main
POSTGRES_USER=eoex_user
POSTGRES_PASSWORD=your_password

# Security (Change in production!)
JWT_SECRET_KEY=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
API_GATEWAY_KEY=your_api_gateway_key

# Feature Flags
ENABLE_GUEST_ACCESS=true
ENABLE_AI_FEATURES=true
ENABLE_3D_ELEMENTS=true
```

## Database Migrations

The application uses SQLAlchemy ORM. Tables are automatically created on first run.

To add new models:
1. Create model in `backend/app/models/`
2. Import in `backend/app/models/__init__.py`
3. Restart the application

## Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET_KEY and ENCRYPTION_KEY
- [ ] Configure PostgreSQL with proper backups
- [ ] Set DEBUG=false
- [ ] Configure CORS for your domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and logging
- [ ] Set up database migrations
- [ ] Configure rate limiting
- [ ] Set up automated backups
- [ ] Configure CI/CD pipeline

### Scaling Considerations
- Implement caching layer (Redis)
- Database connection pooling
- Horizontal scaling with load balancer
- CDN for static assets
- Message queue for async tasks

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## Performance Targets

- Page load time: < 2 seconds (95th percentile)
- API response time: < 200ms
- Real-time latency: < 100ms
- System uptime: > 99.9%
- Concurrent users: 10,000+

## Security

- JWT/OAuth2 authentication
- Role-based access control
- Input validation and sanitization
- OWASP Top 10 compliance
- GDPR compliance for EU users
- Rate limiting and DDoS protection
- End-to-end encryption for sensitive data

## Monitoring & Logging

- ELK Stack for log aggregation
- Grafana for metrics visualization
- Health check endpoints
- Automated alerts for critical issues

## Support

For issues, feature requests, or contributions, please:
1. Check existing issues
2. Create a detailed issue with steps to reproduce
3. Submit pull requests with tests

## License

This project is proprietary. All rights reserved.

## Changelog

### v1.0.0 (2026-01-31)
- Initial release
- Core authentication and user management
- Subscription management system
- Community forum with Q&A
- Real-time chat infrastructure
- Multi-language and theme support
- Docker containerization
- CI/CD pipeline

## Contact

For inquiries, contact the EOEX Platform team.

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0  
**Status**: Development

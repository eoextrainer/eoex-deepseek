# EOEX Frontend Development Guide

## Overview

This guide covers the complete React-based frontend for the EOEX Platform built according to specifications in the docs folder. The frontend implements Netflix-style home page, Disney+-inspired user workspace, and Salesforce-style admin dashboards.

**Last Updated**: January 31, 2026  
**Status**: ✅ Complete and Integrated with Backend

## Quick Start

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Development Server

```bash
npm run dev
```

Access at `http://localhost:3000`

### 3. Connect to Backend

Ensure the backend is running on `http://localhost:8000`:

```bash
# In another terminal, from backend directory
python -m uvicorn app.main:app --reload
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js          # Axios instance with JWT interceptors
│   │   └── endpoints.js       # API endpoint definitions
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   └── index.jsx      # Button, Card, Badge, Modal, Input, etc.
│   │   ├── Navigation.jsx     # Top navigation bar
│   │   └── ThemeSettings.jsx  # Theme/language switcher
│   ├── pages/
│   │   ├── Home.jsx           # Public landing page (Netflix-style)
│   │   ├── Login.jsx          # Authentication
│   │   ├── Register.jsx       # Account creation
│   │   ├── Workspace.jsx      # User dashboard (Disney+-style)
│   │   └── AdminDashboard.jsx # Admin panel (Salesforce-style)
│   ├── store/
│   │   └── index.js           # Zustand state management
│   ├── tests/
│   │   ├── setup.js           # Test configuration
│   │   └── components.test.jsx
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles + Tailwind
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── vitest.config.js           # Test configuration
└── README.md
```

## Component Architecture

### UI Components (Reusable)

Located in [src/components/ui/index.jsx](src/components/ui/index.jsx)

```javascript
// Button variants: primary, secondary, outline, ghost
<Button variant="primary" size="lg">Click Me</Button>

// Card - Dark container with border
<Card>
  <h3>Content</h3>
</Card>

// Badge - Status indicator
<Badge color="red">Active</Badge>

// Input - Form field with validation
<Input 
  label="Email" 
  type="email" 
  error={error}
  onChange={handleChange}
/>

// Modal - Dialog component
<Modal isOpen={open} onClose={handleClose} title="Confirm">
  Content here
</Modal>

// Skeleton - Loading placeholder
<Skeleton className="h-64 rounded-lg" />

// Spinner - Loading indicator
<Spinner size="md" />
```

### Page Components

#### Home Page ([src/pages/Home.jsx](src/pages/Home.jsx))

**Netflix-inspired design** with:
- Hero gradient banner with CTA buttons
- Featured content grid
- Trending modules carousel
- Category filters
- Responsive layout

```javascript
<Home />
```

#### Login Page ([src/pages/Login.jsx](src/pages/Login.jsx))

Features:
- Email/password authentication
- Error handling
- Demo credentials display
- Link to registration

```javascript
<Login />
```

#### Register Page ([src/pages/Register.jsx](src/pages/Register.jsx))

Features:
- First/last name fields
- Email validation
- Password confirmation
- Terms acceptance
- Link to login

```javascript
<Register />
```

#### Workspace ([src/pages/Workspace.jsx](src/pages/Workspace.jsx))

**Disney+-inspired user dashboard** with:
- Personalized highlights section
- Subscription management
- Top 5 favorites grid
- Real-time chat interface
- Tab-based navigation

```javascript
<Workspace />
```

#### Admin Dashboard ([src/pages/AdminDashboard.jsx](src/pages/AdminDashboard.jsx))

**Salesforce-style admin interface** with:
- Stats cards (Users, Subscriptions, Revenue, Engagement)
- User management actions
- Configuration options
- Recent activity log
- Subscription management

```javascript
<AdminDashboard />
```

## State Management

Using **Zustand** for lightweight global state:

### Authentication Store

```javascript
import { useAuthStore } from './store';

const { user, token, isAuthenticated, setUser, setToken, logout } = useAuthStore();
```

Properties:
- `user` - Current user object
- `token` - JWT access token
- `isAuthenticated` - Boolean flag
- `setUser(user)` - Set user data
- `setToken(token)` - Set JWT token (persists to localStorage)
- `logout()` - Clear authentication

### Theme Store

```javascript
import { useThemeStore } from './store';

const { currentTheme, isDarkMode, currentLanguage, setTheme, toggleDarkMode, setLanguage } = useThemeStore();
```

Properties:
- `currentTheme` - Active theme (netflix, disney, dark, light)
- `isDarkMode` - Dark mode toggle
- `currentLanguage` - Selected language code
- All settings persist to localStorage

### UI Store

```javascript
import { useUIStore } from './store';

const { isSidebarOpen, isLoading, notifications, toggleSidebar, setLoading, addNotification } = useUIStore();
```

## API Integration

### Client Setup ([src/api/client.js](src/api/client.js))

Axios instance with:
- Base URL from env variable
- JWT token injection on all requests
- 401 redirect on authentication failure

```javascript
import api from './api/client';

api.get('/users')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### Endpoints ([src/api/endpoints.js](src/api/endpoints.js))

```javascript
import { authAPI, userAPI, subscriptionAPI, communityAPI } from './api/endpoints';

// Authentication
authAPI.register(data)
authAPI.login(data)
authAPI.getCurrentUser()

// Users
userAPI.getUsers()
userAPI.getUser(id)
userAPI.updateUser(id, data)
userAPI.deleteUser(id)

// Subscriptions
subscriptionAPI.getPlans()
subscriptionAPI.getSubscriptions()
subscriptionAPI.getSubscription(id)
subscriptionAPI.createSubscription(data)
subscriptionAPI.updateSubscription(id, data)
subscriptionAPI.deleteSubscription(id)

// Community
communityAPI.getCommunities()
communityAPI.getCommunity(id)
communityAPI.createCommunity(data)
communityAPI.getQuestions(communityId)
communityAPI.createQuestion(communityId, data)
communityAPI.createAnswer(communityId, questionId, data)
```

## Styling

### Tailwind CSS Configuration

Extended config in [tailwind.config.js](tailwind.config.js) includes:

**Custom Colors**:
```css
- eoex-dark (#0f0f0f)
- eoex-darker (#1a1a1a)
- eoex-accent (#e50914)
- netflix-bg (#141414)
- disney-bg (#040714)
- salesforce-bg (#f3f3f3)
```

**Custom Components**:
```css
.transition-smooth    /* Smooth transitions */
.card-hover          /* Scale and shadow on hover */
.glass-effect        /* Glassmorphism effect */
.gradient-text       /* Red gradient text */
```

### Global Styles

[src/index.css](src/index.css) includes:
- Custom scrollbar styling
- Loading shimmer animation
- Base utilities

## Routing

React Router v6 with protected routes:

```javascript
// Public routes
/                    - Home page
/login              - Login page
/register           - Register page

// Protected routes (require authentication)
/workspace          - User dashboard

// Admin routes (require admin role)
/admin              - Admin dashboard
```

### Route Protection

```javascript
// Protected - requires login
<ProtectedRoute>
  <Workspace />
</ProtectedRoute>

// Admin - requires admin role
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

## Testing

### Unit Tests

Located in [src/tests/](src/tests/)

Run tests:
```bash
npm run test           # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:ui       # Vitest UI
```

### Test Setup

[vitest.config.js](vitest.config.js):
- jsdom environment for DOM testing
- Vitest framework
- Coverage reporting

## Environment Variables

Create `.env` file (copy from `.env.example`):

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Feature Flags
VITE_ENABLE_3D=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ADVANCED_ANALYTICS=true

# App Info
VITE_APP_NAME=EOEX Platform
VITE_APP_VERSION=1.0.0
```

## Building

### Development Build

```bash
npm run dev
```

Hot module replacement enabled, accessible at `http://localhost:3000`

### Production Build

```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

Creates optimized build in `dist/` directory.

## Performance Optimization

### Current Optimizations

1. **Code Splitting**: React Router lazy loading
2. **CSS Purging**: Tailwind removes unused styles
3. **Image Optimization**: Placeholder images
4. **Bundling**: Vite tree-shaking and minification
5. **Caching**: Long-term caching with versioned assets

### Recommended Enhancements

1. Add image lazy loading:
```javascript
<img loading="lazy" src={url} />
```

2. Implement React.lazy for routes:
```javascript
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
```

3. Code splitting for large components
4. Service worker for offline support

## Security Considerations

### Implemented

✅ JWT token-based authentication  
✅ Axios interceptors for request/response handling  
✅ Protected routes with role-based access  
✅ XSS protection (React's built-in escaping)  
✅ Token removal on 401 response  

### Recommended

- Add CSRF token handling
- Content Security Policy headers
- Regular dependency updates
- Security headers in production

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Dependencies

### Core
- **react** (18.3.1) - UI library
- **react-dom** (18.3.1) - DOM rendering
- **react-router-dom** (6.20.0) - Client routing
- **vite** (5.0.8) - Build tool

### State & HTTP
- **zustand** (4.4.7) - State management
- **axios** (1.6.5) - HTTP client

### Styling
- **tailwindcss** (3.4.1) - Utility CSS
- **postcss** (8.4.32) - CSS processing

### 3D (Optional)
- **three** (r160) - 3D graphics
- **react-three-fiber** (8.15.0) - React for Three.js
- **drei** (9.96.0) - Useful 3D helpers

### Testing
- **vitest** (1.1.1) - Unit testing
- **@testing-library/react** (14.1.2) - React testing

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/NewPage.jsx`:

```javascript
import React from 'react';
import { Card, Button } from '../components/ui';

export const NewPage = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Your content */}
    </div>
  );
};

export default NewPage;
```

2. Add route in `src/App.jsx`:

```javascript
<Route path="/new-page" element={<NewPage />} />
```

3. Update navigation if needed in `src/components/Navigation.jsx`

### Adding a New Component

1. Create in `src/components/MyComponent.jsx`:

```javascript
export const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

2. Export from appropriate barrel file if needed

### Making API Calls

1. Use endpoints from `src/api/endpoints.js`:

```javascript
import { userAPI } from '../api/endpoints';
import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userAPI.getUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return <div>{/* Render users */}</div>;
};
```

### Using Global State

```javascript
import { useAuthStore, useThemeStore } from '../store';

const MyComponent = () => {
  const { user, logout } = useAuthStore();
  const { currentTheme, setTheme } = useThemeStore();

  return (
    <div>
      <p>User: {user?.email}</p>
      <button onClick={() => setTheme('disney')}>Disney Theme</button>
    </div>
  );
};
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (Unix/Mac)
lsof -ti:3000 | xargs kill -9

# Or specify different port
npm run dev -- --port 3001
```

### API Connection Issues

1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `VITE_API_URL` in `.env` file
3. Verify CORS is enabled on backend

### State not Persisting

Zustand automatically persists to localStorage for:
- `useAuthStore` - token, user
- `useThemeStore` - currentTheme, isDarkMode, currentLanguage

Clear localStorage if needed:
```javascript
localStorage.clear()
```

### Build Errors

1. Clear cache: `rm -rf node_modules/.vite`
2. Reinstall: `npm install`
3. Check Node version: `node --version` (need 16+)

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Create `.env.production`:

```env
VITE_API_URL=https://api.eoex.com
VITE_ENABLE_3D=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ADVANCED_ANALYTICS=true
```

### Hosting Options

1. **Vercel** (Recommended)
   - Zero-config deployment
   - Automatic builds on git push
   - Free tier available

2. **Netlify**
   - Drag-and-drop or Git integration
   - Build plugins available
   - Free tier available

3. **Docker**
   - Create Dockerfile in frontend/
   - Multi-stage build for optimization
   - Include in docker-compose with backend

### Docker Deployment

See [Dockerfile.frontend](../Dockerfile.frontend) for containerization setup.

## Next Steps

### Frontend Features to Implement

- [ ] Forum Q&A interface with voting
- [ ] Real-time chat with WebSocket
- [ ] 3D elements with Three.js
- [ ] Video carousel with autoplay
- [ ] Advanced user profile management
- [ ] Notification system
- [ ] Search functionality
- [ ] Analytics dashboard
- [ ] User impersonation (admin feature)
- [ ] Marketing campaign management UI

### Performance Improvements

- [ ] Image optimization with next/image or similar
- [ ] Code splitting for routes
- [ ] Service worker for offline support
- [ ] CDN integration for assets
- [ ] Analytics and monitoring

### Testing Enhancements

- [ ] E2E tests with Cypress
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing (a11y)

## Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following existing code style
3. Add tests for new components
4. Commit with clear messages: `git commit -m "Add new feature"`
5. Push and create pull request

## Support

For issues or questions:
1. Check this guide first
2. Review similar components in codebase
3. Check GitHub issues
4. Contact development team

## License

MIT - See LICENSE file for details

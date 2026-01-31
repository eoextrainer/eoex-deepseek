# EOEX Frontend

Frontend application for the EOEX Platform - A multi-tiered subscription-based community platform with Netflix-style UI.

## Features

- **Multi-tiered User System**: System Admin, Community Admin, Moderator, User, Guest
- **Netflix-style Home Page**: Hero carousel, trending content, personalized recommendations
- **Disney+-inspired Workspace**: Clean interface, card-based content, responsive design
- **Salesforce-style Admin Dashboard**: Tabs, data tables, metrics, user management
- **Theme System**: 5 pre-defined themes with dark/light mode support
- **Multi-language Support**: European language translations with real-time switching
- **Real-time Chat**: Community user interaction and peer communication
- **Subscription Management**: User subscription control panel
- **Feature Request System**: AI prompt-based feature request submission

## Tech Stack

- **React 18.3**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios**: HTTP client with interceptors
- **Vitest**: Unit testing framework
- **Three.js & Drei**: 3D graphics (optional)

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration
│   │   ├── client.js     # Axios instance with interceptors
│   │   └── endpoints.js  # API endpoint definitions
│   ├── components/       # Reusable React components
│   │   ├── ui/           # Basic UI components
│   │   ├── Navigation.jsx
│   │   └── ThemeSettings.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx      # Netflix-style home
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Workspace.jsx # Disney+-style user workspace
│   │   └── AdminDashboard.jsx
│   ├── store/            # Zustand state management
│   ├── tests/            # Unit tests
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vitest.config.js
└── index.html
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Access at `http://localhost:3000`

## Building

```bash
npm run build
npm run preview
```

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_ENABLE_3D=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ADVANCED_ANALYTICS=true
```

## API Integration

The frontend integrates with the backend API:

- **Base URL**: `http://localhost:8000`
- **Authentication**: JWT Bearer tokens
- **Endpoints**:
  - `POST /register` - User registration
  - `POST /login` - User login
  - `GET /users` - List users
  - `GET /subscriptions` - List subscriptions
  - `GET /communities` - List communities
  - `GET /communities/{id}/questions` - Forum questions

## User Tiers

### System Admin
- Platform performance monitoring
- User lifecycle management
- API key management
- Guest account approval

### Community Admin
- Community dashboard
- Subscription management
- Marketing campaigns
- Feature request vetting

### Community Moderator
- User engagement tracking
- Forum moderation
- Issue management
- User impersonation

### Community User
- Personalized content
- Subscription management
- Chat functionality
- Feature requests

### Guest
- Limited feature access
- Time-restricted preview
- Admin-approved only

## Themes

Available themes (configurable in Settings):

- **Netflix Dark** - Dark mode with red accent
- **Disney+** - Blue accent, clean interface
- **Dark Mode** - Pure black background
- **Light Mode** - Light background with blue accent

## Components

### UI Components
- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Container with dark background
- `Badge` - Status indicators
- `Modal` - Dialog component
- `Input` - Form input with validation
- `Skeleton` - Loading placeholder
- `Spinner` - Loading indicator

### Page Components
- `Home` - Public landing page
- `Login` - Authentication page
- `Register` - Account creation
- `Workspace` - User dashboard (Disney+ style)
- `AdminDashboard` - Admin panel (Salesforce style)

## State Management

Using Zustand for global state:

```javascript
// Authentication
useAuthStore()
  - user
  - token
  - isAuthenticated
  - setUser()
  - setToken()
  - logout()

// Theme
useThemeStore()
  - currentTheme
  - isDarkMode
  - currentLanguage
  - setTheme()
  - toggleDarkMode()
  - setLanguage()

// UI
useUIStore()
  - isSidebarOpen
  - isLoading
  - notifications
  - toggleSidebar()
  - setLoading()
  - addNotification()
  - removeNotification()
```

## Features Implementation Status

- ✅ Authentication (Login/Register)
- ✅ Navigation and routing
- ✅ Theme system with multiple variants
- ✅ Home page with hero carousel
- ✅ User workspace
- ✅ Admin dashboard
- ✅ Subscription management UI
- ✅ Chat interface
- ⏳ Real-time WebSocket integration
- ⏳ Forum Q&A interface
- ⏳ 3D elements (Three.js)
- ⏳ Advanced analytics

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- CSS purging with Tailwind
- Bundle analysis with vite-bundle-visualizer

## Security

- JWT token-based authentication
- Axios interceptors for request/response handling
- Protected routes with role-based access control
- XSS protection with React's built-in escaping
- CSRF tokens in requests

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Create a feature branch
2. Make changes following the component structure
3. Write tests for new components
4. Submit a pull request

## License

MIT

## Support

For issues and feature requests, please submit them through the EOEX Platform's feature request system or contact support@eoex.com.

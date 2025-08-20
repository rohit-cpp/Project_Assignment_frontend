# Exam App Frontend (Student Module) — React (JavaScript)

A production-ready React frontend for the student-side exam-taking module. It integrates seamlessly with the Node.js/Express/MongoDB backend, supports JWT cookie authentication, randomized exams, persistent exam interface with countdown timer, auto-submit functionality, and comprehensive results display.

## 🚀 Features

- **JWT Cookie Authentication** (Register/Login/Logout via backend)
- **Protected Routes** for secure exam flow
- **Start Exam** with navigation between MCQs (Next/Previous)
- **Persistent Exam State** across browser refresh using localStorage
- **Countdown Timer** with automatic submission at time expiry
- **Submit Answers** and view detailed results
- **Modern UI** with optional shadcn/ui components for polished interface
- **Responsive Design** that works on all devices

> **Scope**: Student module only. No admin UI, question upload UI, analytics, or proctoring features.

## 🛠 Tech Stack

- **Frontend**: React 18+ with JavaScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios with cookie support
- **State Management**: React Context + localStorage
- **Styling**: CSS3 + Optional Tailwind CSS with shadcn/ui
- **Environment**: Node.js 18+

## 📋 Requirements

- Node.js 18+
- Backend running at `http://localhost:4000` (or configured via env)
- CORS configured on backend to allow credentials from frontend origin

## 📁 Project Structure

```
client/
  src/
    api/
      http.js                   # Axios configuration
    context/
      AuthContext.jsx          # JWT authentication context
    pages/
      Login.jsx               # Login page
      Register.jsx            # Registration page
      Dashboard.jsx           # Start exam dashboard
      Exam.jsx               # Exam taking interface
      Result.jsx             # Results display
    components/
      PrivateRoute.jsx        # Route protection (optional)
    App.jsx                  # Main app with routing
    main.jsx                # React entry point
    index.css               # Global styles
  .env                      # Environment variables
  package.json             # Dependencies and scripts
  vite.config.js          # Vite configuration
  README.md               # This file

# Optional shadcn/ui structure:
  components/ui/           # Generated UI components
  tailwind.config.js      # Tailwind configuration
  postcss.config.js       # PostCSS configuration
```

## ⚡ Quick Start

### 1. Create Project and Install Dependencies

Create Vite React project and install core dependencies:
- `npm create vite@latest client -- --template react`
- `cd client`
- `npm i axios react-router-dom`

### 2. Optional: Add shadcn/ui for Beautiful UI

Install Tailwind CSS and shadcn/ui components:
- Install Tailwind CSS with PostCSS and Autoprefixer
- Configure Tailwind with proper content paths
- Install and generate shadcn/ui components as needed

### 3. Environment Configuration

Create `client/.env` with:
- `VITE_API_URL` - Backend API URL
- `VITE_EXAM_ID` - Exam template ID from backend seed

### 4. Start Development Server

Run `npm run dev` - App will be available at `http://localhost:5173`

## 🔧 Core Architecture

### HTTP Client Configuration
- Axios instance configured with base URL from environment
- `withCredentials: true` enabled for httpOnly cookie support
- Automatic credential handling for all API requests

### Authentication System
- React Context provider for global auth state management
- User state management with loading states
- Login, register, logout, and current user fetching functions
- Automatic token refresh and session management

### Route Protection
- Private route component that checks authentication status
- Automatic redirects to login for unauthenticated users
- Loading states during authentication checks
- Protected routes for Dashboard, Exam, and Results pages

## 📱 Page Components Overview

### Authentication Pages
- **Login Page**: Email/password form with error handling and registration link
- **Register Page**: Name/email/password form with validation and login redirect

### Dashboard
- Welcome message with user name
- Start exam button that fetches exam data from backend
- Logout functionality
- Error handling for exam start failures

### Exam Interface
- **State Persistence**: Saves current question, answers, and remaining time to localStorage
- **Question Navigation**: Next/Previous buttons with current question tracking
- **Answer Selection**: Radio button interface for multiple choice questions
- **Timer Display**: Real-time countdown with visual warnings for low time
- **Auto-submit**: Automatic submission when timer reaches zero
- **Manual Submit**: Submit button available at any time
- **Progress Tracking**: Shows answered vs total questions

### Results Page
- **Score Display**: Large, prominent score presentation with percentage
- **Status Information**: Submission status and timing details
- **Time Expiry Indicator**: Special notice if exam was auto-submitted
- **Navigation**: Return to dashboard link
- **Error Handling**: Graceful handling of result loading failures

##  ScreenShots
<img width="1194" height="598" alt="Screenshot 2025-08-20 095113" src="https://github.com/user-attachments/assets/7e8362dd-fc9d-4f4e-9428-75769d4571d8" />
<img width="1195" height="813" alt="Screenshot 2025-08-20 095103" src="https://github.com/user-attachments/assets/437f2d19-472a-4e96-a3e1-822359951887" />
<img width="1163" height="473" alt="Screenshot 2025-08-20 095056" src="https://github.com/user-attachments/assets/d6d6c47a-dce6-4714-93ce-6c86bad904f3" />
<img width="998" height="772" alt="Screenshot 2025-08-20 095044" src="https://github.com/user-attachments/assets/1eecaf55-b8c0-43de-a044-75fea09e0fd5" />
<img width="686" height="384" alt="Screenshot 2025-08-19 221641" src="https://github.com/user-attachments/assets/0e127a6e-67d5-43b9-b2aa-d156f602ad9f" />

## 🎨 Styling Options

### Basic CSS Styling
- Clean, minimal design with good typography
- Responsive container layout
- Form styling with focus states
- Button hover and disabled states
- Color-coded elements (success green, error red, etc.)

### shadcn/ui Integration
Option to use shadcn/ui components for enhanced UI:
- Button, Input, Card components
- RadioGroup for question options
- Progress bars for exam completion
- Toast notifications for feedback

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000/api` |
| `VITE_EXAM_ID` | Exam template ID from backend seed | `6507f1f1b2c3d4e5f6789012` |

> **Important**: Restart the dev server after editing `.env` file!

## 🚀 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🔄 Testing Flow

1. **Registration Flow**: Create new account with name, email, password
2. **Authentication**: Login with valid credentials
3. **Dashboard Access**: View welcome screen and exam start option
4. **Exam Start**: Click "Start Exam" to begin (requires valid VITE_EXAM_ID)
5. **Question Navigation**: Use Next/Previous to navigate through questions
6. **Answer Selection**: Select answers using radio buttons
7. **Timer Functionality**: Watch countdown timer, test auto-submit
8. **Manual Submission**: Submit exam before timer expires
9. **Results Display**: View score, percentage, and timing details
10. **Persistence Testing**: Refresh during exam to verify state persistence
11. **Session Management**: Test logout and re-login functionality

## ⚠️ Common Issues & Solutions

### 🍪 CORS or Cookie Issues
**Symptoms**: Authentication not working, 401 errors on protected routes
**Solutions**: 
- Verify backend CORS configuration allows frontend origin with credentials
- Ensure axios withCredentials is properly configured
- Check browser Network tab for cookie transmission

### 📊 Scoring Issues
**Symptoms**: Incorrect or lower than expected scores
**Solutions**:
- Verify answer indices are 0-based and match option order
- Check submit payload includes all selected answers
- Ensure consistent question ID formatting between frontend and backend

### ⏰ Timer Synchronization
**Symptoms**: Timer doesn't match server expectations
**Solutions**:
- Remember backend is authoritative for time limits
- Consider implementing periodic server time sync
- Use client timer primarily for user experience

### 🔄 State Persistence Problems
**Symptoms**: Losing progress on browser refresh
**Solutions**:
- Verify localStorage keys and data format
- Check submissionId consistency across components
- Ensure proper cleanup after exam submission

### 🔐 Authentication Issues
**Symptoms**: Login works but protected routes fail
**Solutions**:
- Verify cookie domain and path settings
- Check SameSite and Secure cookie attributes
- Ensure proper error handling in auth context

## 🚀 Production Deployment

### Frontend Deployment (Vercel/Netlify/etc.)
1. Build the project with `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables in hosting dashboard
4. Set up proper redirects for single-page application routing

### Environment Configuration
- Update `VITE_API_URL` to point to production backend
- Ensure `VITE_EXAM_ID` matches production exam data
- Configure proper CORS origins on backend for production domain

### Backend Integration
- Backend must allow production frontend origin in CORS
- Ensure proper cookie security settings for HTTPS
- Verify API endpoints are accessible from production domain

## 🔒 Security Features

- **httpOnly Cookies**: JWT tokens stored securely, inaccessible to JavaScript
- **CORS Protection**: Cross-origin requests limited to authorized domains
- **Route Protection**: Authentication required for sensitive pages
- **Input Validation**: Client-side validation with server-side enforcement
- **Secure Communication**: HTTPS required in production for cookie security
- **No Sensitive Storage**: Only UI state stored in localStorage, no tokens or answers

## 🎯 Optional Enhancements

### UI/UX Improvements
- Mobile-responsive design with touch-friendly interfaces
- Dark mode toggle with system preference detection
- Toast notifications for better user feedback
- Loading skeletons and smooth transitions
- Progress indicators and completion statistics

### Advanced Features
- **Auto-save**: Periodic answer saving without manual submission
- **Offline Support**: Service worker for basic offline functionality
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Analytics**: User interaction tracking (if required)
- **Multi-language**: i18n support for internationalization

### Performance Optimizations
- Code splitting for faster initial load
- Image optimization and lazy loading
- Bundle size analysis and optimization
- Caching strategies for API responses

## 🔧 Development Best Practices

### Code Organization
- Consistent file naming and folder structure
- Separation of concerns between components
- Reusable utility functions and custom hooks
- Proper error boundaries for component isolation

### State Management
- Minimal context usage to prevent unnecessary re-renders
- Local state for component-specific data
- Proper cleanup of effects and timers
- Consistent error handling patterns

### Performance Considerations
- Memoization for expensive calculations
- Debounced input handlers where appropriate
- Optimized re-rendering with React.memo
- Lazy loading of non-critical components

## 📄 License

This project is provided for evaluation and educational purposes. Adapt and extend as needed for production use.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features where applicable
- Update documentation for significant changes
- Ensure all existing tests pass before submitting PR

---

**Built with ❤️ using React + Vite**

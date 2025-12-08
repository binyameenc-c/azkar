# Azkar App

## Overview

Azkar App is a mobile application built with React Native and Expo for tracking Islamic dhikr (remembrance) counts. It's a personal utility app that allows users to count and track various types of dhikr with daily goals and historical statistics. The app uses local storage (AsyncStorage) for data persistence and does not require authentication or backend connectivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation with native stack navigator for a simple two-screen flow (Home → Counter → Stats)
- **State Management**: React hooks with local component state; TanStack Query configured but primarily for potential future API integration
- **Animations**: Reanimated 4 for smooth UI transitions and gesture handling
- **UI Components**: Custom themed components built on React Native primitives with support for light/dark modes

**Key Design Patterns**:
- Theme system with centralized color and spacing constants
- Safe area handling for modern iOS/Android devices with notches
- Keyboard-aware scroll views for text input compatibility
- Error boundary pattern for graceful error handling
- Custom animated button and card components with spring-based press feedback

**Screen Architecture**:
1. **HomeScreen**: Main menu displaying 6 dhikr options in Arabic
2. **CounterScreen**: Interactive counter with increment/decrement, daily goals, and reset functionality
3. **StatsScreen**: Historical tracking with daily breakdown, total counts, and streak calculation

### Data Storage

**Local Storage Solution**: AsyncStorage (React Native AsyncStorage)
- No backend database required for current functionality
- All dhikr counts, goals, and history stored on-device
- Key patterns:
  - `dhikr_count_[text]`: Total lifetime count
  - `dhikr_daily_[text]_[date]`: Daily count
  - `dhikr_goal_[text]`: User-defined daily goal
  - `dhikr_history_[text]`: Historical daily statistics array

**Data Model**:
- Counter values persist across app sessions
- Daily stats tracked by ISO date strings
- Goal settings customizable per dhikr type
- History maintains array of date-count pairs for trend analysis

### Backend Architecture (Dormant)

**Server Framework**: Express.js with TypeScript
- Configured but not actively used by the app
- CORS setup for Replit domain handling
- Route registration system in place for future API endpoints
- In-memory storage class implemented for potential user data

**Database Schema** (Drizzle ORM + PostgreSQL):
- Users table with UUID primary keys (not currently used)
- Schema defined but database not provisioned for current app functionality
- Migration system configured via Drizzle Kit

**Note**: The backend infrastructure exists for potential future features like cloud sync or multi-device support, but the current app operates entirely client-side.

### Build System

**Development Environment**: Replit with custom build scripts
- Separate dev scripts for Expo packager and Express server
- Static build process for web deployment
- TypeScript compilation with path aliases (`@/*` for client, `@shared/*` for shared)
- Module resolution via Babel for React Native compatibility

**Platform Support**:
- iOS (native)
- Android (native with edge-to-edge enabled)
- Web (single-page output)

## External Dependencies

### Core Framework Dependencies
- **expo** (v54): Main framework for React Native development
- **react-native** (v0.81.5): Core mobile framework
- **react** (v19.1.0): UI library

### Navigation & UI
- **@react-navigation/native**: Core navigation library
- **@react-navigation/native-stack**: Stack-based navigation
- **react-native-gesture-handler**: Touch gesture system
- **react-native-reanimated**: Animation library for smooth transitions
- **react-native-safe-area-context**: Safe area handling for notched devices
- **react-native-screens**: Native screen optimization

### Storage & State
- **@react-native-async-storage/async-storage**: Local key-value storage
- **@tanstack/react-query**: Data fetching and caching (configured for future use)

### Backend (Optional/Future)
- **express**: HTTP server framework
- **pg**: PostgreSQL client (not actively used)
- **drizzle-orm**: TypeScript ORM (schema defined, not connected)
- **zod**: Schema validation library

### Utilities
- **expo-haptics**: Haptic feedback for user interactions
- **expo-splash-screen**: Splash screen management
- **expo-blur**: Blur effects for iOS headers
- **@expo/vector-icons**: Icon library (Ionicons, Feather)
- **react-native-keyboard-controller**: Keyboard behavior management

### Development Tools
- **tsx**: TypeScript execution for server
- **drizzle-kit**: Database migration tool
- **eslint**: Code linting with Expo config
- **prettier**: Code formatting

### Third-Party Services
None currently integrated. All functionality is local and offline-capable.
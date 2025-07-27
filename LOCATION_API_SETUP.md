# Location Verification System

## Overview
A location verification system has been added before registration to ensure the user is within the coverage area.

## Updated Files

### 1. `src/services/authService.ts`
- Added `checkLocation()` function for location verification
- Added `registerUser()` function for user registration with location
- Added data interfaces

### 2. `src/app/[locale]/register/page.tsx`
- Updated registration process to include location verification
- Added loading indicators during verification
- Added error and success messages

### 3. `src/components/checkout/location-step.tsx`
- Updated component to support location verification
- Added loading indicators
- Improved UX

## Environment Variables

Add the `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://backend.roxy-shawerma.com/wp-json/api/v1/
```

## API Endpoints

### Location Verification
- **URL**: `{{Base_URL}}check/locaion`
- **Method**: POST
- **Body**:
```json
{
  "latitude": 30.0444,
  "longitude": 31.2357,
  "address": "Cairo, Egypt"
}
```

### User Registration
- **URL**: `{{Base_URL}}register`
- **Method**: POST
- **Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "location": {
    "latitude": 30.0444,
    "longitude": 31.2357,
    "address": "Cairo, Egypt"
  }
}
```

## Workflow

1. User opens registration page
2. Location selection modal appears
3. User selects their location (from browser or manually)
4. System verifies location via API
5. If location is within coverage → proceed with registration
6. If location is outside coverage → show error message

## Error Messages

- `Your location is outside our service area` - when location is outside coverage
- `Invalid location data` - when data is invalid
- `An error occurred while checking location` - when connection error occurs

## Features

- ✅ Automatic location verification
- ✅ Loading indicators
- ✅ Clear error messages
- ✅ Prevent registration outside coverage
- ✅ Improved user interface
- ✅ Support for Arabic and English 
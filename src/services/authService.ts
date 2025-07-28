// src/services/authService.ts 
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export interface LocationCheckResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const checkLocation = async (location: LocationData): Promise<LocationCheckResponse> => {
  try {
    // Validate location data
    if (!location.latitude || !location.longitude) {
      return {
        success: false,
        message: 'Invalid location data'
      };
    }

    // Use form-data instead of JSON
    const formData = new FormData();
    formData.append('lat', String(location.latitude));
    formData.append('long', String(location.longitude));

    const response = await fetch(`${API_BASE}/check/locaion`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    // Debug: Log API response
    console.log('Location Check API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Location is within coverage area',
        data: data
      };
    } else {
      // Handle specific API error messages
      let errorMessage = 'Your location is outside our service area';
      
      if (data.message) {
        // Map API error messages to user-friendly messages
        if (data.message.includes('Client outside all regions') || 
            data.message.includes('outside') || 
            data.message.includes('coverage')) {
          errorMessage = 'Your location is outside our service area';
        } else {
          errorMessage = data.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        data: data
      };
    }
  } catch (error) {
    console.error('Location check error:', error);
    return {
      success: false,
      message: 'An error occurred while checking location, please try again'
    };
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  city: string;
  states: string;
  lat: number;
  long: number;
  address: string;
}) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    // Debug: Log API response
    console.log('Registration API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Registration successful',
        data: data
      };
    } else {
      // Handle specific API error messages
      let errorMessage = 'Registration failed';
      
      if (data.message) {
        // Map API error messages to user-friendly messages
        if (data.message.includes('Client outside all regions') || 
            data.message.includes('outside') || 
            data.message.includes('coverage')) {
          errorMessage = 'Your location is outside our service area';
        } else {
          errorMessage = data.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        data: data
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration, please try again'
    };
  }
};

export const loginUser = async (loginData: {
  username: string; 
  password: string;
}) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log('Login API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Login successful',
        data: data
      };
    } else {
      let errorMessage = 'Login failed';
      if (data.message) {
        errorMessage = data.message;
      }
      return {
        success: false,
        message: errorMessage,
        data: data
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login, please try again'
    };
  }
};
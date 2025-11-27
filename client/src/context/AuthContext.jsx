import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Add token to requests if it exists
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Fetch current user
    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            // If token is invalid, clear it
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            console.log('Login response:', response.data);

            if (response.data.success) {
                const { token, user } = response.data;

                // Set token in localStorage first
                localStorage.setItem('token', token);

                // Set axios header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Update state
                setToken(token);
                setUser(user);

                // Wait a bit to ensure state updates
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('Login successful, user:', user);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    // Signup function
    const signup = async (name, email, password) => {
        try {
            const response = await axios.post('/api/auth/signup', { name, email, password });
            console.log('Signup response:', response.data);

            if (response.data.success) {
                const { token, user } = response.data;

                // Set token in localStorage first
                localStorage.setItem('token', token);

                // Set axios header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Update state
                setToken(token);
                setUser(user);

                // Wait a bit to ensure state updates
                await new Promise(resolve => setTimeout(resolve, 100));

                console.log('Signup successful, user:', user);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Signup failed'
                };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed. Please try again.'
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

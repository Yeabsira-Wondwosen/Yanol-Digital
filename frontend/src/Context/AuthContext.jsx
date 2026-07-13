import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
const token = localStorage.getItem('token');

if (!token) {
    return <Navigate to="/login" replace />;
}
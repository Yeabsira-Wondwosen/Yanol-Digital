import React from 'react';
import api from '../services/api'; // 1. Make sure to import your api.js file

function Sidebar() {

    // 2. Put the function right here!
    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await api.post('/logout'); // Calls your Laravel API
        } catch (error) {
            console.error("Backend logout failed", error);
        } finally {
            localStorage.removeItem("admin_token"); // Clears the token
            window.location.href = '/login';        // Sends user to login page
        }
    };

    return (
        <div className="sidebar">
            <div className="brand">Yanol UI</div>

            <nav>
                <a href="/overview">Overview</a>
                <a href="/create-quote">Create quote</a>
                <a href="/reports">Reports</a>
            </nav>

            {/* 3. Attach it to your button or link using onClick */}
            <div className="sidebar-footer">
                <button onClick={handleSignOut} className="signout-button">
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
// We need an auth token to access anything here

import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({children}) {
    // Check if we're authorized or redirect to login
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    // Refresh access token automatically
    const refreshToken = async () => {
        // Get refresh token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            // Send token to backend
            const res = await api.post("api/token/refresh/", 
                {refresh: refreshToken
                ,});
            if (res.status === 200) { // We get back an access token
                // Save new access token in local storage
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // Check if we have an access token
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        // We dont have a token
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        // Decode token to access value and exp date
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000; // Date in seconds

        // We have a token and check exp date
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
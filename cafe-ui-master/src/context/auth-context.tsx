import React, { useState, useEffect, createContext, useContext } from "react";

interface AuthContextProps {
  token: string | null;
  login: (newToken: string, expirationTime: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthProvider: React.FC = ({ children } : any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [expirationTime, setExpirationTime] = useState<number | null>(
    localStorage.getItem("tokenExpirationTime")
      ? parseFloat(localStorage.getItem("tokenExpirationTime")!)
      : null
  );

  const login = (newToken: string, newExpirationTime: number) => {
    setToken(newToken);
    setExpirationTime(newExpirationTime);
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpirationTime", newExpirationTime.toString());
  };

  const logout = () => {
    setToken(null);
    setExpirationTime(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpirationTime");
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token && expirationTime && isTokenExpired(expirationTime)) {
        // Token is expired, log the user out
        logout();
      }
    };

    // Check token expiration on component mount and when token changes
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => {
      clearInterval(intervalId);
    };
  }, [token, expirationTime]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const isTokenExpired = (expirationTime: number) => {
  const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
  return currentTime > expirationTime;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

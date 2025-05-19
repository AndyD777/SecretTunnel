import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [error, setError] = useState(null);

    // Load token from sessionStorage on initial load
    useEffect(() => {
      const savedToken = sessionStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setLocation("TABLET");
      }
    }, []);

  // TODO: signup
  async function signup(username) {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setToken(result.token);
      sessionStorage.setItem("token", result.token); // Persist token
      setLocation("TABLET");
      setError(null);
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  }

  // TODO: authenticate

  async function authenticate() {
    if (!token) throw new Error("No token available.");

    try {
      const response = await fetch(`${API}/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setLocation("TUNNEL");
      setError(null);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    }
  }

  const value = {
    location,
    signup,
    authenticate,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}

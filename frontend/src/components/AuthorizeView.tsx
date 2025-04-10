import React, { useState, useEffect, createContext } from "react";
import { Navigate } from "react-router-dom";

const UserContext = createContext<User | null>(null);

interface User {
  email: string;
}

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({ email: "" });

  useEffect(() => {
    console.log("🚀 AuthorizeView useEffect running");

    async function checkAuth() {
      try {
        const response = await fetch(
          "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net//pingauth",
          {
            method: "GET",
            credentials: "include",
          }
        );

        console.log("📡 /pingauth status:", response.status);

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        console.log("🎉 Authenticated user:", data);

        if (data.email) {
          setUser({ email: data.email }); // no role
          setAuthorized(true);
        } else {
          throw new Error("No email returned");
        }
      } catch (error) {
        console.error("❌ Auth failed:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [window.location.pathname]);

  if (loading) return <p>Loading...</p>;
  if (!authorized) {
    console.log("🔒 Not authorized. Redirecting...");
    return <Navigate to="/login" />;
  }

  console.log("🟢 Authorized. Rendering children.");
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null;
  return props.value === "email" ? <>{user.email}</> : null;
}
export const useAuthorizedUser = () => React.useContext(UserContext);

export default AuthorizeView;

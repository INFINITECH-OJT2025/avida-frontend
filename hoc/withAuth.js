import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUser, isTokenExpired } from "@/utils/auth"; // Import both functions

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      async function checkAuth() {
        const token = localStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
          localStorage.removeItem("token"); // Remove expired token
          router.push("/auth/login"); // Redirect to login
          return;
        }

        const user = await getUser(); // Fetch user data
        if (!user) {
          router.push("/auth/login"); // Redirect if user is not found
        } else {
          setLoading(false);
        }
      }

      checkAuth();
    }, []);

    if (loading) {
      return <p>Loading...</p>; // Show loading state while checking authentication
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

// hoc\withAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTokenExpired } from "../src/utils/auth";
import { fetchUser } from "../src/utils/api";

const withAuth = (WrappedComponent) => {
  return function ProtectedPage(props) {
    const [user, setUser] = useState(null); // Optional: Store user info
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("jwt"); // ✅ Use unified key

        if (!token || isTokenExpired(token)) {
          localStorage.removeItem("jwt");
          router.push("/auth/login"); // ✅ Consistent route path
          return;
        }

        try {
          const fetchedUser = await fetchUser();
          if (!fetchedUser) {
            throw new Error("User not found");
          }
          setUser(fetchedUser);
        } catch (error) {
          localStorage.removeItem("jwt");
          router.push("/auth/login");
        }
      };

      checkAuth();
    }, [router]);


    return <WrappedComponent {...props} user={user} />; // ✅ Pass user as prop if needed
  };
};

export default withAuth;

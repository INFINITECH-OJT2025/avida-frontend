// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

// export default function AuthWarning() {
//   const [showWarning, setShowWarning] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const handleTokenExpired = () => setShowWarning(true);
//     window.addEventListener("tokenExpired", handleTokenExpired);

//     return () => window.removeEventListener("tokenExpired", handleTokenExpired);
//   }, []);

//   const handleRelogin = () => {
//     localStorage.removeItem("jwt");
//     router.push("/admin/login"); // ✅ Redirect to login page
//   };

//   if (!showWarning) return null;

//   return (
//     <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-3 font-semibold z-50">
//       ⚠️ Your session has expired. Please <button onClick={handleRelogin} className="underline">re-login</button>.
//     </div>
//   );
// }

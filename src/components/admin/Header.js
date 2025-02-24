// import { useState } from "react";
// import { Bell, Moon, Sun, UserCircle } from "lucide-react";
// import ProfileDropdown from "./ProfileDropdown";

// export default function Header() {
//   const [darkMode, setDarkMode] = useState(false);

//   return (
//     <header className="flex items-center justify-between bg-white p-4 shadow-md">
//       <div className="flex items-center w-1/3">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-gray-300"
//         />
//       </div>

//       <div className="flex items-center space-x-4">
//         <button onClick={() => setDarkMode(!darkMode)}>
//           {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//         </button>

//         <button className="relative">
//           <Bell size={20} />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//             3
//           </span>
//         </button>

//         <ProfileDropdown />
//       </div>
//     </header>
//   );
// }

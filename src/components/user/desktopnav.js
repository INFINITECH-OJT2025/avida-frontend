import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Download } from "lucide-react";
import useConfirmDialog from "../../../src/hooks/useConfirmDialog"; // adjust path if needed

const DesktopNav = () => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timeoutRef = useRef(null);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const { showConfirm, ConfirmDialog } = useConfirmDialog();
    const isActive = (path) => router.pathname === path;

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200);
    };

  // ✅ Handle PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent auto-popup
      setDeferredPrompt(event); // Store event to trigger manually
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
    // ✅ Function to Show Install Prompt
    const installPWA = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("PWA installed successfully");
            } else {
              console.log("PWA installation declined");
            }
            setDeferredPrompt(null); // Reset prompt
          });
        }
      };
    
      const handleRoomPlannerClick = (e) => {
        e.preventDefault(); // Prevent default link behavior
      
        if (window.innerWidth < 1024) {
          alert("Room Planner is only available on desktop/laptop screens.");
          return;
        }
      
        showConfirm(
          "Room Planner requires a desktop or laptop for full experience. Do you want to open it in a new tab?",
          () => {
            window.open("/room-planner", "_blank");
          }
        );
      };
    return (
        <nav className="flex items-center gap-6">
            <Link href="/home" className={`nav-link ${isActive("/home") ? "active-link" : ""}`}>
                Home
            </Link>
            <Link href="/properties" className={`nav-link ${isActive("/properties") ? "active-link" : ""}`}>
                Properties
            </Link>
            <Link href="/about-us" className={`nav-link ${isActive("/about-us") ? "active-link" : ""}`}>
                About Us
            </Link>
            <Link href="/news" className={`nav-link ${isActive("/news") ? "active-link" : ""}`}>
                News and Updates
            </Link>
            <Link href="/careers" className={`nav-link ${isActive("/careers") ? "active-link" : ""}`}>
                Careers
            </Link>
            <Link href="/services" className={`nav-link ${isActive("/services") ? "active-link" : ""}`}>
                Services
            </Link>
            {/* <Link href="/room-planner" className={`nav-link ${isActive("/room-planner") ? "active-link" : ""}`}>
                Room Planner
            </Link> */}
            {/* Forms & Utilities Dropdown */}
            <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <button className={`nav-link flex items-center ${isActive("/user/submit-property") || isActive("/loancalculator") ? "active-link" : ""}`}>
                    Forms & Utilities <span className="ml-1">▼</span>
                </button>
                
                {isDropdownOpen && (
                    <div className="dropdown-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Link href="/user/submit-property" className={`dropdown-item ${isActive("/user/submit-property") ? "dropdown-active" : ""}`}>
                            Submit Property
                        </Link>
                        <Link href="/loancalculator" className={`dropdown-item ${isActive("/loancalculator") ? "dropdown-active" : ""}`}>
                            Loan Calculator
                        </Link>
                        <Link href="/contact-us" className={`dropdown-item ${isActive("/contact-us") ? "dropdown-active" : ""}`}>
                            Contact Us
                        </Link>
                        <button
  onClick={handleRoomPlannerClick}
  className="dropdown-item text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
>
  Room Planner
</button>

                    </div>
                )}
            </div>
            <ConfirmDialog />

        </nav>
    );
};

export default DesktopNav;

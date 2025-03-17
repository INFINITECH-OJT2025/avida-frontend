import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const DesktopNav = () => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timeoutRef = useRef(null);

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
                    </div>
                )}
            </div>
        </nav>
    );
};

export default DesktopNav;

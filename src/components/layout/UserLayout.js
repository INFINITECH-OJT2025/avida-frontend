import { useState } from 'react';
import { Menu, X, Home, Info, Briefcase, Phone } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Contact', href: '/contact', icon: Phone },
];

const UserLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#990e15] text-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl">Avida</span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="hover:underline font-medium">
                {item.name}
              </a>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-[#990e15] px-4 py-2 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 py-2 text-white hover:bg-[#7a0c11] rounded"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                {item.name}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Avida. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;

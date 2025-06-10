import { useState, useEffect } from 'react';

// Clear navigation component that handles scrolling to page sections
const Navbar = () => {
  // State management for mobile menu, scroll position and active section
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Detect active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;
      
      sections.forEach(section => {
        const sectionElement = section as HTMLElement;
        const sectionHeight = sectionElement.offsetHeight;
        const sectionTop = sectionElement.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId || 'accueil');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section and close mobile menu
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'mission', label: 'Mission' },
    { id: 'actions', label: 'Actions' },
    { id: 'calendrier', label: 'Calendrier' },
    { id: 'benevole', label: 'Bénévole' },
    { id: 'don', label: 'Don' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/nousrire_logo.svg"
              alt="Nous'Rire Logo"
              className="h-12 w-auto transform hover:scale-105 transition-transform duration-300"
            />
            <span className="font-bayon text-2xl text-brand-pink-500 ml-2 uppercase tracking-wider">
            <span className="font-bayon text-2xl text-brand-cream-500 ml-2 uppercase tracking-wider">
            Nous
            </span>'RIRE
            </span>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-grow justify-center items-center">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative py-2 text-base font-medium transition-colors whitespace-nowrap
                    ${activeSection === link.id
                      ? 'text-brand-pink-500'
                      : 'text-brand-pink-700 hover:text-brand-pink-500'
                    }
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:w-full after:h-0.5 after:bg-brand-pink-500
                    after:transform after:scale-x-0 after:transition-transform
                    hover:after:scale-x-100
                    ${activeSection === link.id ? 'after:scale-x-100' : ''}
                  `}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-pink-700 hover:text-brand-pink-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden bg-white shadow-lg rounded-b-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium
                  ${activeSection === link.id
                    ? 'bg-brand-pink-50 text-brand-pink-500'
                    : 'text-brand-pink-700 hover:bg-brand-pink-50 hover:text-brand-pink-500'
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
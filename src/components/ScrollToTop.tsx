import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTop Component
 * A button that appears when scrolling down and smoothly scrolls to top when clicked
 */
export const ScrollToTop: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
        showScrollTop
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

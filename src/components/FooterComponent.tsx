import { Copyright } from 'lucide-react';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-auto">
      <div className="flex items-center gap-1">
        <Copyright size={16} />
        <p>Copyright {currentYear} - Vehicle Rental Management System</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
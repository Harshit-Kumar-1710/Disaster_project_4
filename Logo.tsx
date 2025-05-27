import React from 'react';
import { Shield } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-6 w-6' }) => {
  return (
    <div className={`${className} text-blue-600`}>
      <Shield />
    </div>
  );
};

export default Logo;
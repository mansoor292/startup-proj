import React from 'react';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default Card;

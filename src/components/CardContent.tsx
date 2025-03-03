import React from 'react';

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={`p-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default CardContent;

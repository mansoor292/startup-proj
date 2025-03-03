import React from 'react';

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={`p-4 border-b ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default CardHeader;

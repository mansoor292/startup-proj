import React from 'react';

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <h3 className={`text-xl font-bold ${className || ''}`} {...props}>
      {children}
    </h3>
  );
};

export default CardTitle;

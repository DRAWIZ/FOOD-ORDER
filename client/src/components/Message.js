import React from 'react';

const Message = ({ variant = 'info', children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`px-4 py-3 rounded border ${getVariantClasses()} mb-4`}>
      {children}
    </div>
  );
};

export default Message;
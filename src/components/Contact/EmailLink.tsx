import React from 'react';

interface EmailLinkProps {
  className?: string;
}

const EmailLink: React.FC<EmailLinkProps> = ({ className = '' }) => {
  return (
    <a href="mailto:michael@mldangelo.com" className={`hover:underline ${className}`}>
      michael@mldangelo.com
    </a>
  );
};

export default EmailLink;

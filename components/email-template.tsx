import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div style={{ 
    fontFamily: 'Arial, sans-serif', 
    maxWidth: '600px', 
    margin: '0 auto', 
    padding: '20px', 
    backgroundColor: '#f8f8f8', 
    borderRadius: '10px' 
  }}>
    <div style={{ 
      background: 'linear-gradient(135deg, #d4a017 0%, #f5d073 100%)', 
      padding: '30px', 
      textAlign: 'center', 
      borderRadius: '10px 10px 0 0' 
    }}>
      <h1 style={{ color: '#fff', margin: 0 }}>Welcome to ÉDEN</h1>
    </div>
    <div style={{ 
      padding: '30px', 
      backgroundColor: '#fff', 
      borderRadius: '0 0 10px 10px' 
    }}>
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        Dear {firstName},
      </p>
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        Thank you for registering for our newsletter! We're thrilled to welcome you to our exclusive fragrance community.
      </p>
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        You'll now receive early access to new collections, special offers, and invitations to private events.
      </p>
      <div style={{ margin: '30px 0', textAlign: 'center' }}>
        <a 
          href="https://yourwebsite.com" 
          style={{ 
            display: 'inline-block', 
            padding: '12px 24px', 
            backgroundColor: '#d4a017', 
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold' 
          }}
        >
          Explore Our Collection
        </a>
      </div>
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
        If you didn't request this subscription, please ignore this email or contact support.
      </p>
    </div>
  </div>
);
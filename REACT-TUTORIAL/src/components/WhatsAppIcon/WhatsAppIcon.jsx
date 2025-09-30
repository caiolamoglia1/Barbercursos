import React from 'react';

function WhatsAppIcon() {
  return (
    <a href='https://wa.me/4196803577' target='_blank' rel='noopener noreferrer' style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img src='https://www.svgrepo.com/show/184120/whatsapp.svg' alt='WhatsApp' style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        boxShadow: '0 4px 8px rgba(75, 40, 40, 0.2)',
        transition: 'transform 0.3s ease'
      }} />
    </a>
  );
}

export default WhatsAppIcon;

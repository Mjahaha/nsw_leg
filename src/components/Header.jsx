import React from 'react';

const Header = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
            src="/Onyx_logo.png"
            alt="Onyx Regional Logo"
            style={{ height: 40, marginRight: 12 }}
        />
        <span style={{ fontWeight: 'normal', fontSize: 20 }}>Onyx Regional</span>
    </div>
);

export default Header;
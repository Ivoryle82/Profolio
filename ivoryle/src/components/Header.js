import React from 'react';
import '../styles/header.css'

function Header() {
  return (
    <header>
        <div className="logo">quamatbong</div>
        <nav>
          <ul>
            <li><a href="about">About Me</a></li>
            <li><a href="myphotos">My Photos</a></li>
            <li><a href="myspotify">My Spotify</a></li>
            <li><a href="contact">Contact</a></li>
          </ul>
        </nav>
    </header>
  );
}

export default Header;

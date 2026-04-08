import React from 'react';
import { Link } from 'react-router-dom';
import './TopNav.scss';

function TopNav() {
  return (
    <nav className="top-nav">
      <ul className="nav sf-menu">
        <li className="active">
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/courses">Courses</Link>
          <ul>
            <li><Link to="/courses?level=beginner">Beginner</Link></li>
            <li><Link to="/courses?level=intermediate">Intermediate</Link></li>
            <li><Link to="/courses?level=advanced">Advanced</Link></li>
          </ul>
        </li>
        <li>
          <Link to="/pages">Pages</Link>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </ul>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/recipes">Recipes</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default TopNav;

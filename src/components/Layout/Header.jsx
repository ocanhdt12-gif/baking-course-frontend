import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../Navigation/TopNav';
import './Header.scss';

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="page_header s-bordertop nav-narrow ds justify-nav-center header-main">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-xl-2 col-lg-3 col-11">
            <Link to="/" className="logo">
              <img src="/images/logo.png" alt="Muka" />
              <span className="logo-text color-darkgrey">
                Muka
                <strong className="color-main logo-dot">.</strong>
              </span>
            </Link>
          </div>
          <div className="col-xl-8 col-lg-5 col-1 text-sm-center">
            <TopNav />
          </div>
          <div className="col-xl-2 col-lg-4 col-0 text-right">
            <div className="header-icons">
              <button 
                className="search-icon" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <i className="fa fa-search"></i>
              </button>
              <Link to="/cart" className="cart-icon" aria-label="Shopping Cart">
                <i className="fa fa-shopping-cart"></i>
                <span className="cart-count">0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

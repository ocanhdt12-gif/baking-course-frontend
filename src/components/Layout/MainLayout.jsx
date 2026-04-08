import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.scss';

function MainLayout() {
  return (
    <div id="canvas">
      <div id="box_wrapper">
        <Header />
        <main id="main_content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;

import React from 'react';
import { Link } from 'react-router-dom';

const PageTitle = ({ title, breadcrumbs }) => {
  return (
    <section className="page_title ds s-py-10 s-py-xl-25 breadcrumb-image s-overlay">
      <div className="container">
        <div className="row">
          <div className="divider-50"></div>
          <div className="col-md-12 text-center">
            <h1 className="fw-400">{title}</h1>
            <ol className="breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}>
                  {index === breadcrumbs.length - 1 ? (
                    crumb.label
                  ) : (
                    <Link to={crumb.link || '#'}>{crumb.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="divider-50"></div>
        </div>
      </div>
    </section>
  );
};

export default PageTitle;

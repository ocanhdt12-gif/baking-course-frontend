import React from 'react';
import { siteConfig } from '../../config/siteConfig';
import { useTranslation } from '../../i18n/LanguageContext';

const ContactInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="col-lg-4 animate" data-animation="scaleAppear">
      <h4 className="contact-info">{t('contact.infoTitle') || 'Contact Info'}</h4>

      <p className="icon-inline">
        <span className="icon-styled color-main2 fs-14">
          <i className="fa fa-map-marker"></i>
        </span>
        <span>{siteConfig.contact.address}</span>
      </p>

      <p className="icon-inline">
        <span className="icon-styled color-main2 fs-14">
          <i className="fa fa-phone"></i>
        </span>
        <span>{siteConfig.contact.phone}</span>
      </p>

      <p className="icon-inline contact-link with-border">
        <span className="icon-styled color-main2 fs-14">
          <i className="fa fa-envelope"></i>
        </span>
        <span>
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        </span>
      </p>

      <p className="icon-inline contact-link">
        <span className="icon-styled color-main2 fs-14">
          <i className="fa fa-internet-explorer"></i>
        </span>
        <span>
          <a href="#">www.muka_cooking.com</a>
        </span>
      </p>

      <p className="icon-inline">
        <span className="icon-styled color-main2 fs-14">
          <i className="fa fa-clock-o"></i>
        </span>
        <span>{t('contact.hours') || 'Weekdays: 9 am - 7 pm'}</span>
      </p>
    </div>
  );
};

export default ContactInfo;

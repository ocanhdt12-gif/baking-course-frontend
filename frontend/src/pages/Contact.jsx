import React from 'react';
import PageTitle from '../components/Shared/PageTitle';
import ContactForm from '../components/Contact/ContactForm';
import ContactInfo from '../components/Contact/ContactInfo';
import { siteConfig } from '../config/siteConfig';

const Contact = () => {
  return (
    <>
      <PageTitle 
        title="Contact Us"
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Contact' }]}
      />

			<section className="ls ms page_map" data-draggable="true" data-scrollwheel="true">
				<div className="marker">
					<div className="marker-address">{siteConfig.contact.address}</div>
					<div className="marker-title">Main Location</div>
					<div className="marker-description">
						<img src="images/logo.png" alt=""/>
						<ul className="list-unstyled">
							<li>
								<span className="icon-inline">
									<span className="icon-styled color-main"><i className="fa fa-map-marker"></i></span>
									<span>{siteConfig.contact.address}</span>
								</span>
							</li>
							<li>
								<span className="icon-inline">
									<span className="icon-styled color-main"><i className="fa fa-phone"></i></span>
									<span>{siteConfig.contact.phone}</span>
								</span>
							</li>
							<li>
								<span className="icon-inline">
									<span className="icon-styled color-main"><i className="fa fa-envelope"></i></span>
									<span>{siteConfig.contact.email}</span>
								</span>
							</li>
						</ul>
					</div>
					<img className="marker-icon" src="images/map_marker_icon.png" alt=""/>
				</div>
			</section>

			<section className="ls s-pt-50 s-pb-130 c-gutter-60 contacts">
				<div className="container">
					<div className="row">
						<div className="divider-20 d-none d-xl-block"></div>
						
            <ContactForm />
            <ContactInfo />

						<div className="divider-30 d-none d-xl-block"></div>
					</div>
				</div>
			</section>
    </>
  );
};

export default Contact;

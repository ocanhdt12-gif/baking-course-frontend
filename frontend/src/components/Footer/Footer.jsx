import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <>
      <footer className="page_footer ds s-pt-90 s-pb-15 s-pt-lg-130 s-pb-lg-75 c-gutter-60 s-parallax">
        <div className="s-pt-60 s-pb-60 s-py-lg-60 cs cs2 s-parallax s-overlay discount text-center text-lg-left">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3>Do You Want to Get a 30% Discount?</h3>
                <h6 className="small-text">Fill in the registration form for the course now and get a discount</h6>
              </div>
              <div className="col-lg-4 text-center text-lg-right">
                <Link to={ROUTES.CONTACT} className="btn btn-lightcolor">fill out the form now</Link>
              </div>
            </div>
          </div>
          <div className="divider-10"></div>
        </div>

        <div className="container">
          <div className="row">
            <div className="divider-30 d-none d-xl-block"></div>

            <div className="col-md-12 col-lg-4 animate text-center text-lg-left" data-animation="fadeInUp">
              <div className="widget widget_icons_list footer-list">
                <div className="text-center">
                  <Link to={ROUTES.HOME} className="logo logo-footer">
                    <img src="images/logo.png" alt="" />
                    <span className="logo-text color-darkgrey">{siteConfig.logoText}<strong className="color-main">{siteConfig.logoDot}</strong></span>
                  </Link>
                </div>
                <p className="after-logo">{siteConfig.description}</p>
                <p className="icon-inline">
                  <span className="icon-styled color-main2"><i className="fa fa-map-marker"></i></span>
                  <span>{siteConfig.contact.address}</span>
                </p>
                <p className="icon-inline">
                  <span className="icon-styled color-main2"><i className="fa fa-phone"></i></span>
                  <span>{siteConfig.contact.phone}</span>
                </p>
                <p className="icon-inline">
                  <span className="icon-styled color-main2"><i className="fa fa-envelope"></i></span>
                  <span><a className="border-bottom" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></span>
                </p>
                <p className="icon-inline">
                  <span className="icon-styled color-main2"><i className="fa fa-internet-explorer"></i></span>
                  <span><Link to={ROUTES.HOME}>{siteConfig.contact.website}</Link></span>
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 animate" data-animation="fadeInUp">
              <div className="widget widget_recent_posts">
                <h3 className="widget-title">Recent Posts</h3>
                <ul className="list-unstyled">
                  <li className="media">
                    <Link className="media-image" to={ROUTES.RECEIPT}><img src="images/events/01.jpg" alt="" /></Link>
                    <div className="media-body">
                      <p><Link to={ROUTES.RECEIPT}>Pro Cooking Tips Braising Meats For Tenderness</Link></p>
                      <h6 className="item-meta"><i className="fa fa-calendar color-main"></i>20 jan, 18</h6>
                    </div>
                  </li>
                  <li className="media">
                    <Link className="media-image" to={ROUTES.RECEIPT}><img src="images/events/02.jpg" alt="" /></Link>
                    <div className="media-body">
                      <p><Link to={ROUTES.RECEIPT}>Barbecue Party Tips For A Truly Amazing Event</Link></p>
                      <h6 className="item-meta"><i className="fa fa-calendar color-main"></i>23 jan, 18</h6>
                    </div>
                  </li>
                  <li className="media">
                    <Link className="media-image" to={ROUTES.RECEIPT}><img src="images/events/03.jpg" alt="" /></Link>
                    <div className="media-body">
                      <p><Link to={ROUTES.RECEIPT}>The Best Way To Cook Your Freshly Caught Fish</Link></p>
                      <h6 className="item-meta"><i className="fa fa-calendar color-main"></i>25 jan, 18</h6>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 animate text-center text-lg-left" data-animation="fadeInUp">
              <div className="widget widget_mailchimp footer_mailchimp">
                <h3 className="widget-title">{siteConfig.footer.newsletterTitle}</h3>
                <p>{siteConfig.footer.newsletterDescription}</p>
                <form className="signup" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
                  <label htmlFor="mailchimp_email"><span className="screen-reader-text">Subscribe:</span></label>
                  <input id="mailchimp_email" name="email" type="email" className="form-control mailchimp_email ds" placeholder="Enter Email address" />
                  <button type="submit" className="btn btn-maincolor">Subscribe</button>
                  <div className="response"></div>
                </form>
              </div>
            </div>
            <div className="divider-20 d-none d-xl-block"></div>
          </div>
        </div>
      </footer>

      <section className="page_copyright ds s-py-25 s-py-lg-5 s-parallax s-overlay footer-overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="divider-20 d-none d-lg-block"></div>
            <div className="col-md-12 text-center">
              <p>&copy; Copyright <span className="copyright_year">{siteConfig.copyrightYear}</span> All Rights Reserved</p>
            </div>
            <div className="divider-20 d-none d-lg-block"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;

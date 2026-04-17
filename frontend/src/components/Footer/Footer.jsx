import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { ROUTES } from '../../constants/routes';
import { useTranslation } from '../../i18n/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <footer className="page_footer ds s-pt-90 s-pb-15 s-pt-lg-130 s-pb-lg-75 c-gutter-60 s-parallax">
        <div className="s-pt-60 s-pb-60 s-py-lg-60 cs cs2 s-parallax s-overlay discount text-center text-lg-left">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3>{t('footer.discountTitle')}</h3>
                <h6 className="small-text">{t('footer.discountSub')}</h6>
              </div>
              <div className="col-lg-4 text-center text-lg-right">
                <Link to={ROUTES.CONTACT} className="btn btn-lightcolor">{t('footer.discountCta')}</Link>
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
                    <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="" />
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
                <h3 className="widget-title">{t('footer.recentPosts')}</h3>
                <ul className="list-unstyled">
                  <li className="media">
                    <Link className="media-image" to={ROUTES.RECEIPT}><img src={`${import.meta.env.BASE_URL}images/events/01.jpg`} alt="" /></Link>
                    <div className="media-body">
                      <p><Link to={ROUTES.RECEIPT}>Bí Kíp Làm Bánh Mì Cực Ngon Cho Bữa Sáng</Link></p>
                      <h6 className="item-meta"><i className="fa fa-calendar color-main"></i>20 Thg 1, 2026</h6>
                    </div>
                  </li>
                  <li className="media">
                    <Link className="media-image" to={ROUTES.RECEIPT}><img src={`${import.meta.env.BASE_URL}images/events/02.jpg`} alt="" /></Link>
                    <div className="media-body">
                      <p><Link to={ROUTES.RECEIPT}>Cách Trang Trí Bánh Kem Sinh Nhật Đẹp Mắt</Link></p>
                      <h6 className="item-meta"><i className="fa fa-calendar color-main"></i>23 Thg 1, 2026</h6>
                    </div>
                  </li>
                  <li className="media">
                    <Link className="media-image" to={ROUTES.RECEIPT}><img src={`${import.meta.env.BASE_URL}images/events/03.jpg`} alt="" /></Link>
                    <div className="media-body">
                      <p><Link to={ROUTES.RECEIPT}>Mẹo Nướng Bánh Macaron Chuẩn Pháp</Link></p>
                      <h6 className="item-meta"><i className="fa fa-calendar color-main"></i>25 Thg 1, 2026</h6>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 animate text-center text-lg-left" data-animation="fadeInUp">
              <div className="widget widget_mailchimp footer_mailchimp">
                <h3 className="widget-title">{siteConfig.footer.newsletterTitle}</h3>
                <p>{siteConfig.footer.newsletterDescription}</p>
                <form className="signup" onSubmit={(e) => { e.preventDefault(); alert(t('footer.subscribeSuccess') || 'Cảm ơn bạn đã đăng ký!'); }}>
                  <label htmlFor="mailchimp_email"><span className="screen-reader-text">Subscribe:</span></label>
                  <input id="mailchimp_email" name="email" type="email" className="form-control mailchimp_email ds" placeholder={t('footer.emailPlaceholder') || 'Nhập địa chỉ Email'} />
                  <button type="submit" className="btn btn-maincolor">{t('footer.subscribe')}</button>
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
              <p>&copy; {t('footer.copyright', { year: siteConfig.copyrightYear }) || `Bản quyền ${siteConfig.copyrightYear} Mọi Quyền Được Bảo Lưu`}</p>
            </div>
            <div className="divider-20 d-none d-lg-block"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;

import React from 'react';

function Home() {
  return (
    <div id="canvas">
      <div id="box_wrapper">
        {/* HEADER */}
        <div className="header_absolute">
          <header className="page_header s-bordertop nav-narrow ds justify-nav-center header-main">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-3 col-11">
                  <a href="./" className="logo">
                    <img src="/images/logo.png" alt="Muka" />
                    <span className="logo-text color-darkgrey">
                      Muka<strong className="color-main logo-dot">.</strong>
                    </span>
                  </a>
                </div>
                <div className="col-xl-8 col-lg-5 col-1 text-sm-center">
                  <nav className="top-nav">
                    <ul className="nav sf-menu">
                      <li className="active"><a href="/">Homepage</a></li>
                      <li><a href="/about">Pages</a></li>
                      <li><a href="/programs">Programs</a></li>
                      <li><a href="/recipes">Recipes</a></li>
                      <li><a href="/contact">Contact</a></li>
                    </ul>
                  </nav>
                </div>
                <div className="col-xl-2 col-lg-3 text-left text-xl-right d-none d-lg-block">
                  <a href="#" className="btn btn-maincolor2">Visit workshop</a>
                </div>
              </div>
            </div>
            <span className="toggle_menu"><span></span></span>
          </header>
        </div>

        {/* HERO SLIDER */}
        <section className="page_slider">
          <div className="flexslider" data-nav="true" data-dots="false">
            <ul className="slides">
              <li className="ds text-center">
                <span className="flexslider-overlay"></span>
                <img src="/images/slide01.jpg" alt="Slide" />
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="intro_layers_wrapper">
                        <div className="intro_layers">
                          <div className="intro_layer" data-animation="fadeInUp">
                            <h6 className="text-uppercase intro_after_featured_word color-main">
                              Cooking is Easy, We Will Prove it to You!
                            </h6>
                          </div>
                          <div className="intro_layer" data-animation="fadeInUp">
                            <h2 className="intro_featured_word">Next Cooking Class Starts In:</h2>
                          </div>
                          <div className="intro_layer flex-countdown" data-animation="fadeInUp">
                            <div id="flex-countdown" data-date="December 31, 2026 23:59:59"></div>
                          </div>
                          <div className="intro_layer flex-btn" data-animation="fadeInUp">
                            <a href="#" className="btn btn-maincolor">enroll now</a>
                            <a href="#" className="btn btn-light">our feedback</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="ds text-center slide02">
                <span className="flexslider-overlay"></span>
                <img src="/images/slide02.jpg" alt="Slide" />
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="intro_layers_wrapper">
                        <div className="intro_layers">
                          <div className="intro_layer" data-animation="fadeInUp">
                            <h6 className="text-uppercase intro_after_featured_word color-main">Learn from Experts</h6>
                          </div>
                          <div className="intro_layer" data-animation="fadeInUp">
                            <h2 className="intro_featured_word">Professional Cooking Classes</h2>
                          </div>
                          <div className="intro_layer flex-btn" data-animation="fadeInUp">
                            <a href="#" className="btn btn-maincolor">enroll now</a>
                            <a href="#" className="btn btn-light">learn more</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="ds text-center slide03">
                <span className="flexslider-overlay"></span>
                <img src="/images/slide03.jpg" alt="Slide" />
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="intro_layers_wrapper">
                        <div className="intro_layers">
                          <div className="intro_layer" data-animation="fadeInUp">
                            <h6 className="text-uppercase intro_after_featured_word color-main">Master the Art</h6>
                          </div>
                          <div className="intro_layer" data-animation="fadeInUp">
                            <h2 className="intro_featured_word">Join Our Cooking Community</h2>
                          </div>
                          <div className="intro_layer flex-btn" data-animation="fadeInUp">
                            <a href="#" className="btn btn-maincolor">get started</a>
                            <a href="#" className="btn btn-light">watch demo</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* PROGRAMS */}
        <section className="ls s-py-40 s-py-lg-130 program" id="classes">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 text-center">
                <h6 className="small-text color-main2">Round the Globe</h6>
                <h3>Our Cooking Classes</h3>
                <img className="image-wrap" src="/images/icon-main.png" alt="icon" />
                <div className="divider-60"></div>

                <div className="row">
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="vertical-item text-center bordered">
                      <img src="/images/service/01.jpg" alt="Baking" />
                      <h5><a href="#">Baking & Pastry</a></h5>
                      <p>Capicola kielbasa pork belly cow alcatra pancetta rump sausage meatloaf.</p>
                      <div className="program-icon text-center">
                        <div><i className="fa fa-users color-main"></i> 18</div>
                        <div><i className="fa fa-comments color-main"></i> 423</div>
                        <div><i className="fa fa-money color-main"></i> 550$</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="vertical-item text-center bordered">
                      <img src="/images/service/02.jpg" alt="Meat" />
                      <h5><a href="#">Fish, Meat & Poultry</a></h5>
                      <p>Venison prosciutto beef pork loin doner chuck sirloin filet mignon.</p>
                      <div className="program-icon text-center">
                        <div><i className="fa fa-users color-main"></i> 23</div>
                        <div><i className="fa fa-comments color-main"></i> 658</div>
                        <div><i className="fa fa-money color-main"></i> 480$</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="vertical-item text-center bordered">
                      <img src="/images/service/03.jpg" alt="Exotic" />
                      <h5><a href="#">Exotic Cuisines</a></h5>
                      <p>Pig venison pork, leberkas biltong short loin beef ribs meatball bacon.</p>
                      <div className="program-icon text-center">
                        <div><i className="fa fa-users color-main"></i> 12</div>
                        <div><i className="fa fa-comments color-main"></i> 359</div>
                        <div><i className="fa fa-money color-main"></i> 660$</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="ls ms right-part-bg">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <img src="/images/video-image.jpg" alt="Video" />
              </div>
              <div className="col-lg-6">
                <h3>Hello, Welcome to Muka!</h3>
                <p>Professional cooking classes and culinary education.</p>
                <div className="media">
                  <i className="fa fa-trophy color-main2 me-3"></i>
                  <div>
                    <h5>We Are Winners of 50 Competitions</h5>
                    <p>Award-winning culinary excellence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="footer" className="page_footer ds ms">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h4>About Muka</h4>
                <p>Professional cooking classes for everyone.</p>
              </div>
              <div className="col-md-4">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/about">About</a></li>
                  <li><a href="/programs">Programs</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h4>Follow Us</h4>
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-instagram"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
              </div>
            </div>
            <hr />
            <div className="text-center">
              <p>&copy; 2026 Muka. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;

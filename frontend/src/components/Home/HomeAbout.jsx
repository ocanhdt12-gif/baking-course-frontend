import React from 'react';


const HomeAbout = () => {
	return (
		<section className="ls ms s-pt-lg-100 s-pb-lg-75 c-my-0 video-part right-part-bg text-center text-md-left" id="about">
			<div className="cover-image s-cover-left"></div>
			<div className="row align-items-center">
				<div className="col-12 col-lg-6 order-lg-1">
					<a href="images/video-image.jpg" className="photoswipe-link" data-iframe="https://www.youtube.com/embed/mcixldqDIEQ">
						<img src="images/video-image.jpg" alt="" />
						<div className="video-text">
							<h5>
								<span>Watch</span>
								<span className=" iframe-link"></span>
								<span>Video</span>
							</h5>
						</div>
					</a>
				</div>
				<div className="col-12 col-lg-6 order-lg-2  animate" data-animation="slideInRight">
					<div className="d-none d-lg-block divider-90"></div>
					<div className="item-content">
						<h6 className="fs-14 color-main text-uppercase">our achievements</h6>
						<h3>Hello, Welcome to Muka!</h3>
						<div className="icon-image">
							<img src="images/icon-3.png" alt="" />
						</div>
						<div className="d-none d-lg-block divider-50"></div>
						<div className="media">
							<div className="icon-styled color-main2">
								<i className="fa fa-trophy"></i>
							</div>
							<div className="media-body">
								<h5>
									We Are Winners of 50 Competitions
								</h5>
								<p>
									Salami corned beef short loin sausage meatloaf fatback andouille kielbasa frankfurter sirloin alcatra beef ribs.
								</p>
							</div>
						</div>
						<div className="media">
							<div className="icon-styled color-main2">
								<i className="fa fa-group"></i>
							</div>
							<div className="media-body">
								<h5>
									27 Professional Chefs-Trainers
								</h5>
								<p>
									Ham hock jerky tail kevin, buffalo shoulder doner venison leberkas pig beef burgdoggen flank ribeye picanha burgdoggen.
								</p>
							</div>
						</div>
						<div className="media">
							<div className="icon-styled color-main2">
								<i className="fa fa-hourglass-half"></i>
							</div>
							<div className="media-body">
								<h5>
									Guaranteed Fast Employment
								</h5>
								<p>
									Ball tip landjaeger pork chop, kielbasa shank filet mignon cow burgdoggen cupim buffalo porchetta. Ribeye beef ribs flank.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="d-none d-lg-block divider-50"></div>
		</section>
	);
};

export default HomeAbout;

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const HomeChiefs = ({ chiefs }) => {
  const carouselRef = useRef(null);


	return (
		<section className="ls s-py-40 s-py-lg-130 chiefs chiefs-carousel ls animate" data-animation="fadeInUp" id="chiefs">
			<div className="container">
				<div className="divider-25"></div>
				<div className="row">
					<div className="col-sm-12 text-center">
						<div className="section-heading">
							<h6 className="small-text color-main">Our team of proffesionals</h6>
							<h3>Best Chefs of America</h3>
							<img className="image-wrap" src={`${import.meta.env.BASE_URL}images/icon-main2.png`} alt="" />
						</div>
						<div className="d-none d-lg-block divider-60"></div>
						<div ref={carouselRef} className="owl-carousel carousel-nav" data-responsive-lg="3" data-responsive-md="2" data-responsive-sm="2" data-responsive-xs="1" data-nav="true" data-loop="true">
              {chiefs.map((chief) => (
						<div key={chief.id} className="vertical-item content-absolute content-hover text-center">
							<div className="item-media">
								<img src={chief.image} alt="" />
							</div>
							<div className="item-content bg-maincolor-transparent">
								<h4>
									<Link className="dark" to={ROUTES.CHIEF_DETAIL(chief.id)}>{chief.name}</Link>
								</h4>
								<h6 className="small-text">
									{chief.role}
								</h6>
								<div className="content-body">
									<p className="social-icons">
										{chief.socialFb && <a href={chief.socialFb} className="fa fa-facebook color-light" title="facebook" target="_blank" rel="noopener noreferrer"></a>}
										{chief.socialTw && <a href={chief.socialTw} className="fa fa-twitter color-light" title="twitter" target="_blank" rel="noopener noreferrer"></a>}
										{chief.socialIn && <a href={chief.socialIn} className="fa fa-google-plus color-light" title="google" target="_blank" rel="noopener noreferrer"></a>}
									</p>
									<div className="team-button">
										<Link to={ROUTES.CHIEF_DETAIL(chief.id)} className="btn btn-team">view profile</Link>
									</div>
								</div>
							</div>
						</div>
              ))}
						</div>
						<div className="divider-30 d-none d-xl-block"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeChiefs;

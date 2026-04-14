import React from 'react';


const HomeFaq = () => {
  return (
    <section className="s-pt-40 s-pb-50 s-py-lg-130 ds faq s-overlay bg-card" id="faq">
				<div className="container">
					<div className="divider-25"></div>
					<div className="row c-gutter-60">
						<div className="col-12 text-center">
							<div className="section-heading">
								<h6 className="small-text color-main2">Round the Globe</h6>
								<h3>FAQ / Our Location</h3>
								<img className="image-wrap" src={`${import.meta.env.BASE_URL}images/icon-main.png`} alt=""/>
							</div>
						</div>
						<div className="d-none d-lg-block divider-60"></div>
						<div className="col-md-6">
							<div id="accordion01" role="tablist">
								<div className="card">
									<div className="card-header" role="tab" id="collapse01_header">
										<h5>
											<a data-toggle="collapse" href="#collapse01" aria-expanded="true" aria-controls="collapse01">
												<i className="fa fa-pencil" aria-hidden="true"></i>
												Bacon ipsum dolor amet tail?
											</a>
										</h5>
									</div>

									<div id="collapse01" className="collapse show" role="tabpanel" aria-labelledby="collapse01_header" data-parent="#accordion01">
										<div className="card-body">
											<p>
												Bacon ipsum dolor amet boudin jerky chuck turkey tail shank andouille capicola shankle corned beef shoulder jowl. Turducken short loin kielbasa ribeye salami filet.
											</p>

										</div>
									</div>
								</div>

								<div className="card">
									<div className="card-header" role="tab" id="collapse02_header">
										<h5>
											<a className="collapsed" data-toggle="collapse" href="#collapse02" aria-expanded="false" aria-controls="collapse02">
												<i className="fa fa-pencil" aria-hidden="true"></i>
												Lorem ipsum dolor sit amet elit?
											</a>
										</h5>
									</div>
									<div id="collapse02" className="collapse" role="tabpanel" aria-labelledby="collapse02_header" data-parent="#accordion01">
										<div className="card-body">
											<p>
												Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson.
											</p>
										</div>
									</div>
								</div>

								<div className="card">
									<div className="card-header" role="tab" id="collapse04_header">
										<h5>
											<a className="collapsed" data-toggle="collapse" href="#collapse04" aria-expanded="false" aria-controls="collapse04">
												<i className="fa fa-pencil" aria-hidden="true"></i>
												Integer venenatis tellus et est?
											</a>
										</h5>
									</div>
									<div id="collapse04" className="collapse" role="tabpanel" aria-labelledby="collapse04_header" data-parent="#accordion01">
										<div className="card-body">
											<p>
												Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable sunt aliqua put a bird on.
											</p>
										</div>
									</div>
								</div>

								<div className="card">
									<div className="card-header" role="tab" id="collapse05_header">
										<h5>
											<a className="collapsed" data-toggle="collapse" href="#collapse05" aria-expanded="false" aria-controls="collapse05">
												<i className="fa fa-pencil" aria-hidden="true"></i>
												Maecenas vel libero ex nec?
											</a>
										</h5>
									</div>
									<div id="collapse05" className="collapse" role="tabpanel" aria-labelledby="collapse05_header" data-parent="#accordion01">
										<div className="card-body">
											<p>
												Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="ls page_map">
								<div className="marker">
									<div className="marker-address">sydney, australia, Liverpool street, 66</div>
									<div className="marker-title">Muka</div>
									<div className="marker-description">

										<ul className="list-unstyled">
											<li>
												<span className="icon-inline">
													<span className="icon-styled color-main">
														<i className="fa fa-map-marker"></i>
													</span>

													<span>
														828 Curtis Ferry, NY
													</span>
												</span>
											</li>

											<li>
												<span className="icon-inline">
													<span className="icon-styled color-main">
														<i className="fa fa-clock-o"></i>
													</span>

													<span>
														wd: 9 am - 7 pm
													</span>
												</span>
											</li>
										</ul>
									</div>

									<img className="marker-icon" src={`${import.meta.env.BASE_URL}images/map_marker_icon2.png`} alt=""/>
								</div>

							</div>
						</div>
					</div>
					<div className="divider-20"></div>
				</div>
			</section>
  );
};

export default HomeFaq;

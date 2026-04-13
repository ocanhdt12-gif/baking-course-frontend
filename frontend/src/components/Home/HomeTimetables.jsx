import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const HomeTimetables = ({ schedules = [] }) => {
  useEffect(() => {
    if (window.jQuery && schedules.length > 0) {
      const currentDayName = DAYS_OF_WEEK[new Date().getDay()];
      const index = DAYS_OF_WEEK.indexOf(currentDayName);
      setTimeout(() => {
        const $ = window.jQuery;
        $('.form-tabs li a').eq(index).tab('show');
        $('#tab_selector').val(index);
      }, 100);
    }
  }, [schedules]);
	return (
		<section className="s-pt-40 s-pb-30 s-py-lg-130 timetable ls text-center text-md-left" id="timetables">
			<div className="container">
				<div className="divider-25"></div>
				<div className="row">
					<div className="col-12 text-center">
						<div className="section-heading">
							<h6 className="small-text color-main">updated schedule</h6>
							<h3>Timetable of Classes</h3>
							<img className="image-wrap" src="images/icon-main2.png" alt="" />
						</div>
						<div className="d-none d-lg-block divider-60"></div>
					</div>
					<div className="col-12">

						{/* Desktop Tabs */}
						<ul className="nav nav-tabs form-tabs visible-md">
							{DAYS_OF_WEEK.map((day, index) => {
								const currentDayName = DAYS_OF_WEEK[new Date().getDay()];
								const isDefault = day === currentDayName;
								return (
									<li key={day} className={`tab-selector nav-item ${isDefault ? 'active' : ''}`}>
										<a className={`nav-link ${index === 0 ? 'first' : ''} ${index === 6 ? 'last' : ''}`} href={`#tab${index + 1}`} data-toggle="tab">
											{day}
										</a>
									</li>
								);
							})}
						</ul>

						{/* Mobile Select */}
						<select className="form-control hidden-md hidden-lg hidden-xl" id="tab_selector">
							{DAYS_OF_WEEK.map((day, index) => (
								<option key={day} value={index}>{day}</option>
							))}
						</select>

						{/* Tab Contents */}
						<div className="tab-content">
							{DAYS_OF_WEEK.map((day, index) => {
								const dayPrograms = schedules.filter(p => p.dayOfWeek === day);
								const currentDayName = DAYS_OF_WEEK[new Date().getDay()];
								const isDefault = day === currentDayName;

								return (
									<div key={day} className={`tab-pane ${isDefault ? 'active' : ''}`} id={`tab${index + 1}`}>
										{dayPrograms.length > 0 ? (
											dayPrograms.map(session => (
												<div key={session.id} className="media bordered">
													<Link to={`/program/${session.program.slug}`} className="ds">
														<img src={session.program.thumbnail || "images/gallery/01.jpg"} alt={session.program.title} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
													</Link>
													<div className="media-body">
														<h5>
															<Link to={`/program/${session.program.slug}`}>{session.program.title}</Link>
														</h5>
														<div className="btn-timetable">
															<Link to={`/program/${session.program.slug}`} className="btn btn-outline-maincolor">About Class</Link>
														</div>
														<div className="item-meta">
															<i className="fa fa-calendar color-main2"></i>
															<span>{session.startDate ? new Date(session.startDate).toLocaleDateString() : ''} - {session.endDate ? new Date(session.endDate).toLocaleDateString() : ''}</span>
															{session.timeRange && (
																<>
																	<i className="fa fa-clock-o color-main2"></i>
																	<span>{session.timeRange}</span>
																</>
															)}
															{(session.instructorOverride || session.program.authorName) && (
																<>
																	<i className="fa fa-user color-main2"></i>
																	<span>{session.instructorOverride || session.program.authorName}</span>
																</>
															)}
														</div>
													</div>
												</div>
											))
										) : (
											<p className="text-center pt-4 pb-4">No classes scheduled for {day}.</p>
										)}
									</div>
								);
							})}
						</div>

					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeTimetables;

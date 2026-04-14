import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const HomeBlog = ({ posts }) => {
  const carouselRef = useRef(null);

  // Extract unique categories from posts, ignore missing
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];


	return (
		<section className="ls s-py-40 s-py-lg-130 blog-carousel animate" data-animation="fadeInUp" id="blog">
			<div className="container">
				<div className="divider-25"></div>
				<div className="row">
					<div className="col-sm-12 text-center">
						<div className="section-heading">
							<h6 className="small-text color-main">Latest news Muka</h6>
							<h3>Our Fresh Blog Posts</h3>
						</div>
						<div className="d-block d-md-none divider-20"></div>
						<div className="row justify-content-center">
							<div className="col-md-10 col-xl-6">
								<div className="filters gallery-filters small-text text-lg-right">
									<a href="#" data-filter="*" className="active selected">All Categories</a>
									{categories.map(cat => {
										const filterClass = cat.toLowerCase().replace(/\s+/g, '-');
										return (
											<a key={filterClass} href="#" data-filter={`.${filterClass}`}>{cat}</a>
										);
									})}
								</div>
							</div>
						</div>
						<div ref={carouselRef} className="owl-carousel  carousel-nav" data-responsive-lg="3" data-responsive-md="2" data-responsive-sm="2" data-responsive-xs="1" data-nav="true" data-loop="true" data-filters=".gallery-filters">
              {posts.map((post) => {
                const catClass = post.category ? post.category.toLowerCase().replace(/\s+/g, '-') : '';
                return (
							<article key={post.id} className={`vertical-item text-center content-padding padding-small bordered post type-post status-publish format-standard has-post-thumbnail ${catClass}`}>
								<div className="item-media post-thumbnail">
									<img src={post.thumbnail} alt="" />
									<div className="media-links">
										<Link className="abs-link" to={ROUTES.POST_DETAIL(post.slug)}></Link>
									</div>
									<div className="entry-meta small-text bg-dark-transpatent">
										<span className="byline">
											<span className="posted-on">
												<span className="screen-reader-text">Posted on</span>
												<Link to={ROUTES.POST_DETAIL(post.slug)} rel="bookmark">
													<i className="fa fa-calendar color-main2"></i>
													<time dateTime={post.dateIso} className="entry-date published updated">{post.dateString}</time>
												</Link>
											</span>
											<span className="category-links links-maincolor">
												<span className="screen-reader-text">Categories</span>
												<Link to={ROUTES.POST_DETAIL(post.slug)} rel="category tag">
													<i className="fa fa-tags color-main2"></i>
													{post.category}
												</Link>
											</span>
											<span className="author vcard">
												<Link className="url fn n" to={ROUTES.POST_DETAIL(post.slug)}>
													<i className="fa fa-user color-main2"></i>
													{post.authorName}
												</Link>
											</span>
										</span>
									</div>
								</div>

								<div className="item-content">
									<header className="entry-header">
										<h4 className="entry-title">
											<Link to={ROUTES.POST_DETAIL(post.slug)} rel="bookmark">
												{post.title}
											</Link>
										</h4>
									</header>

									<div className="entry-content">
										<p>{post.desc}</p>
									</div>
								</div>

								<div className="text-center blog-btn ">
									<Link to={ROUTES.POST_DETAIL(post.slug)} className="btn btn-outline-maincolor">view more</Link>
								</div>
							</article>
                );
              })}
						</div>
						<div className="divider-30 d-none d-xl-block"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeBlog;

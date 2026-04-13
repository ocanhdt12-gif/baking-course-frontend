import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTitle from '../components/Shared/PageTitle';
import { getProgramBySlug } from '../services/api';
import { ROUTES } from '../constants/routes';

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState('');

  useEffect(() => {
    getProgramBySlug(slug)
      .then(data => {
        setProgram(data);
        
        // Auto-select first upcoming session if exists
        if (data.classSessions && data.classSessions.length > 0) {
          const upcoming = data.classSessions.filter(s => new Date(s.startDate) >= new Date());
          if (upcoming.length > 0) {
            setSelectedSessionId(upcoming[0].id);
          } else {
            setSelectedSessionId(data.classSessions[0].id);
          }
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch Program details", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Loading Course Details...</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Program Not Found.</h2>
      </div>
    );
  }

  return (
    <>
      <PageTitle 
        title="Course Details"
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Programs', link: ROUTES.PROGRAM }, { label: program.title }]}
      />
      
      <section className="ls s-pt-75 s-pb-0 s-py-lg-100 c-gutter-60 program-single">
        <div className="container">
          <div className="row">
            <main className="col-lg-7 col-xl-8 vertical-item content-padding">
              <div className="item-media">
                {program.thumbnail && (
                  <img src={program.thumbnail.startsWith('http') ? program.thumbnail : `/${program.thumbnail}`} alt={program.title} />
                )}
                
                <div className="content-absolute bg-maincolor-transparent text-left ds">
                  <div className="d-inline">
                    <span>
                      <i className="fa fa-users color-light"></i>
                      {program.students || 0}
                    </span>
                    <span>
                      <i className="fa fa-comments color-light"></i>
                      {program.reviews || 0}
                    </span>
                    <span>
                      <i className="fa fa-money color-light"></i>
                      {program.price || 'Free'}
                    </span>
                  </div>
                </div>
              </div>
                
              <div className="item-content bordered">
                <h4>{program.title}</h4>
                <div className="content-preview mt-4" dangerouslySetInnerHTML={{ __html: program.description?.replace(/\n/g, '<br/>') || 'No description provided.' }} />

                <div className="row c-mb-5 c-mb-lg-25 mt-4">
                  <div className="col-md-6">
                    <h5>You Will Learn:</h5>
                    
                    {program.learningGoals && program.learningGoals.map((g, i) => (
                      <React.Fragment key={i}>
                        <span className="small-text fs-14">{g.skill}</span>
                        <div className="progress">
                          <div className={`progress-bar ${i % 2 === 0 ? 'bg-maincolor' : 'bg-maincolor2'}`} role="progressbar" style={{ width: `${g.percent}%` }} aria-valuenow={g.percent} aria-valuemin="0" aria-valuemax="100">
                            <span>{g.percent}%</span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    
                    {(!program.learningGoals || program.learningGoals.length === 0) && (
                      <p className="text-muted">Learning goals will be updated soon.</p>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <h5>Class Includes:</h5>
                    <ul className="list-styled">
                      {program.classIncludes && program.classIncludes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {(!program.classIncludes || program.classIncludes.length === 0) && (
                      <p className="text-muted">Included activities will be updated soon.</p>
                    )}
                  </div>
                </div>

                <h4 className="mt-5 mb-4">Curriculum Overview</h4>
                <div id="accordion01" role="tablist">
                  {program.curriculum && program.curriculum.map((mod, i) => (
                    <div className="card" key={i}>
                      <div className="card-header" role="tab" id={`collapse${i}_header`}>
                        <h5>
                          <a data-toggle="collapse" href={`#collapse${i}`} aria-expanded={i === 0 ? "true" : "false"} aria-controls={`collapse${i}`} className={i === 0 ? "" : "collapsed"}>
                            {mod.title}
                          </a>
                        </h5>
                      </div>
                      <div id={`collapse${i}`} className={`collapse ${i === 0 ? 'show' : ''}`} role="tabpanel" aria-labelledby={`collapse${i}_header`} data-parent="#accordion01">
                        <div className="card-body">
                          {mod.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!program.curriculum || program.curriculum.length === 0) && (
                    <p className="text-muted">Curriculum will be updated soon.</p>
                  )}
                </div>

              </div>
            </main>

            <aside className="col-lg-5 col-xl-4">
              <div className="bg-maincolor2 widget-search p-30 mb-60 mt-5 mt-lg-0">
                <div className="widget widget_search">
                  <h5>Search On Website</h5>
                  <p>Find more exciting news and offers</p>
                  <form role="search" method="get" className="search-form" action="/">
                    <label htmlFor="search-form-widget">
                      <span className="screen-reader-text">Search for:</span>
                    </label>
                    <input type="search" id="search-form-widget" className="search-field form-control" placeholder="Type Keyword Here..." defaultValue="" name="search" />
                    <button type="submit" className="search-submit">
                      <span className="screen-reader-text">Type Keyword Here...</span>
                    </button>
                  </form>
                </div>
              </div>

              <div className="widget widget_categories">
                <h3 className="widget-title">Enroll in this Program</h3>
                <p>Join {program.students || 0} students who have already registered for this amazing experience.</p>
                
                {program.classSessions && program.classSessions.length > 0 ? (
                  <div className="mt-3">
                    <label>Select Cohort/Session:</label>
                    <select 
                      className="form-control" 
                      value={selectedSessionId} 
                      onChange={e => setSelectedSessionId(e.target.value)}
                      style={{ height: '45px' }}
                    >
                      {program.classSessions.map(session => (
                        <option key={session.id} value={session.id}>
                          {session.dayOfWeek} • {session.timeRange} ({session.startDate ? new Date(session.startDate).toLocaleDateString() : 'TBA'})
                        </option>
                      ))}
                    </select>
                    <div className="mt-4 text-center">
                      <a href={`/?session=${selectedSessionId}#contacts`} className="btn btn-maincolor btn-block">Enroll Now</a>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <button className="btn btn-dark btn-block" disabled>No Classes Available</button>
                  </div>
                )}
              </div>

              {(program.chief || program.authorImage) && (
                <div className="widget widget_instructor text-center p-4 mt-4 bordered">
                  <h4 className="widget-title">Your Instructor</h4>
                  <img src={(program.chief?.image || program.authorImage).startsWith('http') ? (program.chief?.image || program.authorImage) : `/${(program.chief?.image || program.authorImage)}`} alt={program.chief?.name || program.authorName} className="rounded-circle mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                  <h5>{program.chief?.name || program.authorName}</h5>
                  <p className="small-text color-main">{program.chief?.role || 'Master Chef'}</p>
                  {program.chief && (
                    <div className="mt-3">
                      <Link to={`/chiefs/${program.chief.id}`} className="btn btn-sm btn-outline-maincolor">View Profile</Link>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgramDetail;

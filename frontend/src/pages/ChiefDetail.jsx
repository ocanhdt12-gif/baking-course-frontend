import { useInitOnLoaded } from '../hooks/useInitOnLoaded';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTitle from '../components/Shared/PageTitle';
import { getChiefById, submitContact } from '../services/api';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-toastify';

const ChiefDetail = () => {
  const { id } = useParams();
  const [chief, setChief] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getChiefById(id)
      .then(data => {
        // parse skills if stored as string
        let parsedSkills = [];
        if (data.skills) {
          try {
            parsedSkills = JSON.parse(data.skills);
          } catch (e) { console.error(e); }
        }
        setChief({ ...data, parsedSkills });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch Chief details", err);
        setLoading(false);
      });
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: `Regarding Instructor: ${chief.name}`,
        message: formData.message
      });
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast.error("Failed to send message. Please try again later.");
    }
    setSubmitting(false);
  };

  useInitOnLoaded(loading);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Loading Instructor Profile...</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!chief) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Instructor Not Found.</h2>
      </div>
    );
  }

  // highlights
  const highlights = chief.highlights ? chief.highlights.split('|').map(s => s.trim()).filter(Boolean) : [];

  return (
    <>
      <PageTitle 
        title="Instructor Profile"
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Instructors', link: ROUTES.CHIEFS }, { label: chief.name }]}
      />
      
      <section className="ls s-pt-75 s-pb-10 s-pt-lg-100 s-pb-lg-50 c-mb-30 chief-profile">
        <div className="container">
          <div className="row">
            <div className="d-none d-lg-block divider-60"></div>
            
            <div className="col-12">
              <div className="row c-gutter-60">
                <div className="col-md-5">
                  <div className="vertical-item content-absolute text-center">
                    <div className="item-media">
                      <img src={chief.image ? (chief.image.startsWith('http') ? chief.image : `${import.meta.env.BASE_URL}${chief.image.replace(/^\//, '')}`) : '/images/team/single-profile.jpg'} alt={chief.name} />
                    </div>
                    <div className="item-content bg-maincolor-transparent">
                      <h4>{chief.name}</h4>
                      <h6 className="small-text">{chief.role}</h6>
                      <p className="social-icons">
                        {chief.socialFb && <a href={chief.socialFb} className="fa fa-facebook color-light" title="facebook"></a>}
                        {chief.socialTw && <a href={chief.socialTw} className="fa fa-twitter color-light" title="twitter"></a>}
                        {chief.socialIn && <a href={chief.socialIn} className="fa fa-google-plus color-light" title="google"></a>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-7 mt-4 mt-md-0">
                  {chief.bio && <p style={{ whiteSpace: 'pre-wrap' }}>{chief.bio}</p>}
                  {!chief.bio && (
                    <p>
                      {chief.name} is one of our most distinguished instructors, specializing as a {chief.role}. With years of hands-on experience in the culinary arts, they bring a wealth of expertise and passion to every class.
                    </p>
                  )}

                  {highlights.length > 0 && (
                    <ul className="list-styled mt-4 mb-4">
                      {highlights.map((hl, i) => <li key={i}>{hl}</li>)}
                    </ul>
                  )}

                  {/* tabs start */}
                  <ul className="nav nav-tabs mt-40" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" id="tab01" data-toggle="tab" href="#tab01_pane" role="tab" aria-controls="tab01_pane" aria-expanded="true">Biography</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="tab02" data-toggle="tab" href="#tab02_pane" role="tab" aria-controls="tab02_pane">Skills</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="tab03" data-toggle="tab" href="#tab03_pane" role="tab" aria-controls="tab03_pane">Send Message</a>
                    </li>
                  </ul>

                  <div className="tab-content mb-40">
                    <div className="tab-pane fade show active" id="tab01_pane" role="tabpanel" aria-labelledby="tab01">
                      {chief.biography ? (
                        <div dangerouslySetInnerHTML={{ __html: chief.biography }} />
                      ) : (
                        <p>Detailed biography for {chief.name} will be updated soon.</p>
                      )}
                      
                      <div className="mt-5">
                        <Link to={`${ROUTES.PROGRAM}?chiefId=${chief.id}`} className="btn btn-maincolor">View My Classes</Link>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="tab02_pane" role="tabpanel" aria-labelledby="tab02">
                      <p>
                        Dutem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit. Praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
                      </p>
                      {(!chief.parsedSkills || chief.parsedSkills.length === 0) ? (
                        <p>Skill details will be updated soon.</p>
                      ) : (
                        chief.parsedSkills.map((sk, index) => (
                          <React.Fragment key={index}>
                            <span className="small-text progress-title">{sk.name}</span>
                            <div className="progress">
                              <div className="progress-bar bg-maincolor" role="progressbar" data-transitiongoal={sk.percent} style={{ width: `${sk.percent}%` }} aria-valuenow={sk.percent} aria-valuemin="0" aria-valuemax="100">
                                <span>{sk.percent}%</span>
                              </div>
                            </div>
                          </React.Fragment>
                        ))
                      )}
                      <p>
                        <br /> Ut wisi enim ad minim veniaquis nostrud exetation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Dutem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit.
                      </p>
                    </div>

                    <div className="tab-pane fade" id="tab03_pane" role="tabpanel" aria-labelledby="tab03">
                      <form className="contact-form" onSubmit={handleContactSubmit}>
                        <p className="contact-form-name">
                          <input type="text" aria-required="true" size="30" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-control" placeholder="Full Name" required />
                        </p>
                        <p className="contact-form-email">
                          <input type="email" aria-required="true" size="30" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-control" placeholder="Email Address" required />
                        </p>
                        <p className="contact-form-message">
                          <textarea aria-required="true" rows="6" cols="45" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="form-control" placeholder="Message..." required></textarea>
                        </p>
                        <div className="divider-20"></div>
                        <p className="contact-form-submit">
                          <button type="submit" className="btn btn-maincolor" disabled={submitting}>
                            {submitting ? 'Sending...' : 'Send Message'}
                          </button>
                        </p>
                      </form>
                    </div>
                  </div>
                  {/* tabs end */}

                  <p>
                    Andouille meatball pork doner pork loin jerky capicola sirloin picanha. Spare ribs burgdoggen beef ribs, ground round chuck kevin meatball jerky t-bone. Sausage buffalo beef ribs, chuck pork belly t-bone turkey swine filet mignon short loin. Bresaola chicken salami pork. Chicken t-bone short ribs, short loin porchetta flank rump shankle ball tip ham.
                  </p>

                  <blockquote className="bordered layout-2">
                    <div>
                      <h6 className="small-text color-main2 margin-0">former student</h6>
                      <h5>Michael Delgado</h5>
                    </div>
                    <p>«Sirloin porchetta tenderloin flank. Prosciutto doner kielbasa andouille, turkey jowl ham cupim flank sirloin tenderloin. Picanha ball tip meatball shank. Buffalo pork belly cow boudin corned.»</p>
                  </blockquote>

                  <p>
                    Biltong sausage ham hock burgdoggen leberkas short ribs pork loin alcatra meatball. Salami doner tongue spare ribs chuck turkey burgdoggen biltong meatball jowl porchetta beef ribs shank brisket ball tip. Porchetta turkey pastrami.
                  </p>

                </div>
              </div>
            </div>
            
            <div className="d-none d-lg-block divider-60"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChiefDetail;

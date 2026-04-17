import { useInitOnLoaded } from '../hooks/useInitOnLoaded';
import './ProgramDetail.css';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageTitle from '../components/Shared/PageTitle';
import { getProgramBySlug } from '../services/api';
import { formatPrice } from '../utils/formatters';
import { ROUTES } from '../constants/routes';
import { useTranslation } from '../i18n/LanguageContext';

const VI_DAYS = {
  MONDAY: 'Thứ 2',
  TUESDAY: 'Thứ 3',
  WEDNESDAY: 'Thứ 4',
  THURSDAY: 'Thứ 5',
  FRIDAY: 'Thứ 6',
  SATURDAY: 'Thứ 7',
  SUNDAY: 'Chủ Nhật'
};

const ProgramDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
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

  useInitOnLoaded(loading);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>{t('programDetail.loading')}</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>{t('programDetail.notFound')}</h2>
      </div>
    );
  }

  const hasPurchased = program.hasPurchased === true;
  const orderStatus = program.orderStatus;
  const premiumContent = program.premiumContent;

  // Determine CTA button state
  const getCTAButton = () => {
    if (hasPurchased) {
      return (
        <button className="btn btn-success btn-block" disabled>
          <i className="fa fa-check-circle mr-1"></i> {t('programDetail.owned')}
        </button>
      );
    }
    const checkoutUrl = selectedSessionId 
      ? `${ROUTES.CHECKOUT(slug)}?session=${selectedSessionId}`
      : ROUTES.CHECKOUT(slug);

    if (orderStatus === 'PENDING' || orderStatus === 'AWAITING_CONFIRM') {
      return (
        <button 
          className="btn btn-warning btn-block" 
          onClick={() => navigate(checkoutUrl)}
        >
          <i className="fa fa-clock-o mr-1"></i> {t('programDetail.continuePay')}
        </button>
      );
    }
    if (program.price && program.price > 0) {
      return (
        <button 
          className="btn btn-maincolor btn-block" 
          onClick={() => navigate(checkoutUrl)}
        >
          <i className="fa fa-shopping-cart mr-1"></i> {t('programDetail.buy')} — {formatPrice(program.price)}
        </button>
      );
    }
    return (
      <a href={`/?session=${selectedSessionId}#contacts`} className="btn btn-maincolor btn-block">{t('programDetail.enrollFree')}</a>
    );
  };

  return (
    <>
      <PageTitle 
        title={t('programDetail.title') || 'Chi Tiết Khóa Học'}
        breadcrumbs={[
          { label: t('header.home'), link: '/' }, 
          { label: t('header.programs') || 'Khóa Học', link: ROUTES.PROGRAM }, 
          { label: program.title }
        ]}
      />
      
      <section className="ls s-pt-75 s-pb-0 s-py-lg-100 c-gutter-60 program-single">
        <div className="container">
          <div className="row">
            <main className="col-lg-7 col-xl-8 vertical-item content-padding">
              <div className="item-media">
                {program.thumbnail && (
                  <img src={program.thumbnail.startsWith('http') ? program.thumbnail : `${import.meta.env.BASE_URL}${program.thumbnail.replace(/^\//, '')}`} alt={program.title} />
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
                      {formatPrice(program.price)}
                    </span>
                  </div>
                </div>
              </div>
                
              <div className="item-content bordered">
                <h4>{program.title}</h4>
                <div className="content-preview mt-4" dangerouslySetInnerHTML={{ __html: program.description?.replace(/\n/g, '<br/>') || t('common.noDescription') || 'Chưa có thông tin mô tả.' }} />

                <div className="row c-mb-5 c-mb-lg-25 mt-4">
                  <div className="col-md-6">
                    <h5>{t('programDetail.willLearn')}</h5>
                    
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
                      <p className="text-muted">{t('programDetail.learningGoalsEmpty')}</p>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <h5>{t('programDetail.classIncludes')}</h5>
                    <ul className="list-styled">
                      {program.classIncludes && program.classIncludes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {(!program.classIncludes || program.classIncludes.length === 0) && (
                      <p className="text-muted">{t('programDetail.classIncludesEmpty')}</p>
                    )}
                  </div>
                </div>

                <h4 className="mt-5 mb-4">{t('programDetail.curriculum')}</h4>
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
                          {hasPurchased ? (
                            mod.content
                          ) : (
                            <div className="text-muted">
                              <i className="fa fa-lock mr-1"></i> {t('programDetail.lockedContent')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!program.curriculum || program.curriculum.length === 0) && (
                    <p className="text-muted">{t('programDetail.curriculumEmpty')}</p>
                  )}
                </div>

                {/* Premium Content Section */}
                {hasPurchased && premiumContent && (
                  <div className="premium-section mt-5">
                    <div className="premium-header">
                      <span className="premium-badge"><i className="fa fa-star mr-1"></i> {t('premium.badge')}</span>
                      <p className="premium-subtitle">{t('premium.subtitle')}</p>
                    </div>

                    {/* Premium Tabs */}
                    <div className="premium-tabs">
                      {premiumContent.videos?.length > 0 && (
                        <button className="premium-tab active" data-tab="videos" onClick={e => {
                          document.querySelectorAll('.premium-tab').forEach(t => t.classList.remove('active'));
                          document.querySelectorAll('.premium-panel').forEach(p => p.classList.remove('active'));
                          e.target.classList.add('active');
                          document.getElementById('panel-videos').classList.add('active');
                        }}>
                          <i className="fa fa-play-circle mr-1"></i> {t('premium.tabs.videos')}
                        </button>
                      )}
                      {premiumContent.resources?.length > 0 && (
                        <button className="premium-tab" data-tab="resources" onClick={e => {
                          document.querySelectorAll('.premium-tab').forEach(t => t.classList.remove('active'));
                          document.querySelectorAll('.premium-panel').forEach(p => p.classList.remove('active'));
                          e.target.classList.add('active');
                          document.getElementById('panel-resources').classList.add('active');
                        }}>
                          <i className="fa fa-file-pdf-o mr-1"></i> {t('premium.tabs.resources')}
                        </button>
                      )}
                      {premiumContent.guides && (
                        <button className="premium-tab" data-tab="guides" onClick={e => {
                          document.querySelectorAll('.premium-tab').forEach(t => t.classList.remove('active'));
                          document.querySelectorAll('.premium-panel').forEach(p => p.classList.remove('active'));
                          e.target.classList.add('active');
                          document.getElementById('panel-guides').classList.add('active');
                        }}>
                          <i className="fa fa-book mr-1"></i> {t('premium.tabs.guides')}
                        </button>
                      )}
                    </div>

                    {/* Videos Panel */}
                    {premiumContent.videos?.length > 0 && (
                      <div id="panel-videos" className="premium-panel active">
                        <div className="row">
                          {premiumContent.videos.map((video, i) => (
                            <div className="col-md-6 mb-4" key={i}>
                              <div className="video-card">
                                <div className="video-wrapper">
                                  <iframe src={video.url} title={video.title || `Lesson ${i + 1}`} allowFullScreen></iframe>
                                </div>
                                <div className="video-info">
                                  <span className="video-num">{t('premium.lessonNum', { num: i + 1 })}</span>
                                  <h6>{video.title || t('premium.lessonFallback', { num: i + 1 })}</h6>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources Panel */}
                    {premiumContent.resources?.length > 0 && (
                      <div id="panel-resources" className="premium-panel">
                        <div className="row">
                          {premiumContent.resources.map((res, i) => (
                            <div className="col-md-6 mb-3" key={i}>
                              <a href={res.url} target="_blank" rel="noopener noreferrer" className="resource-card">
                                <div className="resource-icon">
                                  <i className="fa fa-file-pdf-o"></i>
                                </div>
                                <div className="resource-info">
                                  <h6>{res.title || `Resource ${i + 1}`}</h6>
                                  <small>{t('premium.downloadHint')}</small>
                                </div>
                                <i className="fa fa-download resource-dl"></i>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guides Panel */}
                    {premiumContent.guides && (
                      <div id="panel-guides" className="premium-panel">
                        <div className="guide-content" dangerouslySetInnerHTML={{ __html: premiumContent.guides.replace(/\n/g, '<br/>') }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Lock Overlay for Non-Purchasers */}
                {!hasPurchased && program.price > 0 && (
                  <div className="premium-lock mt-5">
                    <div className="premium-lock-inner">
                      {/* FOMO Preview — show blurred content hints */}
                      <div className="premium-lock-preview">
                        <div className="lock-preview-item"><i className="fa fa-play-circle"></i> {t('premium.lock.previewVideos')}</div>
                        <div className="lock-preview-item"><i className="fa fa-file-pdf-o"></i> {t('premium.lock.previewResources')}</div>
                        <div className="lock-preview-item"><i className="fa fa-book"></i> {t('premium.lock.previewGuides')}</div>
                      </div>

                      <div className="premium-lock-content">
                        <div className="lock-icon-wrap">
                          <i className="fa fa-lock"></i>
                        </div>
                        <h4>{t('premium.lock.title')}</h4>
                        <p>{t('premium.lock.description')}</p>
                        <button 
                          className="btn btn-maincolor btn-lg lock-cta"
                          onClick={() => navigate(ROUTES.CHECKOUT(slug))}
                        >
                          <i className="fa fa-shopping-cart mr-2"></i> {t('premium.lock.unlock', { price: formatPrice(program.price) })}
                        </button>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </main>

            <aside className="col-lg-5 col-xl-4">
              <div className="bg-maincolor2 widget-search p-30 mb-60 mt-5 mt-lg-0">
                <div className="widget widget_search">
                  <h5>{t('programDetail.search') || 'Tìm kiếm trên Website'}</h5>
                  <p>{t('programDetail.searchDesc') || 'Tìm kiếm thêm tin tức và ưu đãi hấp dẫn'}</p>
                  <form role="search" method="get" className="search-form" action="/">
                    <label htmlFor="search-form-widget">
                      <span className="screen-reader-text">Search for:</span>
                    </label>
                    <input type="search" id="search-form-widget" className="search-field form-control" placeholder={t('programDetail.searchPlaceholder') || 'Nhập từ khóa...'} defaultValue="" name="search" />
                    <button type="submit" className="search-submit">
                      <span className="screen-reader-text">{t('programDetail.searchPlaceholder') || 'Nhập từ khóa...'}</span>
                    </button>
                  </form>
                </div>
              </div>

              <div className="widget widget_categories">
                <h3 className="widget-title">
                  {hasPurchased ? (t('programDetail.courseOwned') || 'Đã sở hữu') : (t('programDetail.getCourse') || 'Đăng ký khóa học')}
                </h3>
                <p>{t('programDetail.joinStudents', { count: program.students || 0 }) || `Cùng ${program.students || 0} học viên đã đăng ký trải nghiệm tuyệt vời này.`}</p>
                
                {/* Program Type Badge */}
                <div className="mb-3">
                  <span className={`program-type-badge-inline ${program.programType === 'VIDEO_COURSE' ? 'video' : 'live'}`}>
                    {program.programType === 'VIDEO_COURSE' 
                      ? (t('programType.videoBadge') || '🎬 Video — Xem mọi lúc') 
                      : (t('programType.liveBadge') || '👨‍🍳 Trực tiếp — Có lịch cụ thể')}
                  </span>
                </div>

                {/* Class Session Selector - Only for LIVE_CLASS */}
                {program.programType === 'LIVE_CLASS' && program.classSessions && program.classSessions.length > 0 && (
                  <div className="mt-3">
                    <label>{t('programDetail.selectCohort') || 'Chọn Lớp:'}</label>
                    <select 
                      className="form-control" 
                      value={selectedSessionId} 
                      onChange={e => setSelectedSessionId(e.target.value)}
                      style={{ height: '45px' }}
                    >
                      {program.classSessions.map(session => (
                        <option key={session.id} value={session.id}>
                          {VI_DAYS[(session.dayOfWeek || '').toUpperCase()] || session.dayOfWeek} • {session.timeRange} ({session.startDate ? new Date(session.startDate).toLocaleDateString('vi-VN') : 'TBA'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-4">
                  {getCTAButton()}
                  {orderStatus === 'REJECTED' && (
                    <div className="mt-2 text-center">
                      <small className="text-danger">
                        <i className="fa fa-exclamation-triangle mr-1"></i>
                        {t('programDetail.rejectedMsg') || 'Thanh toán trước đó bị từ chối.'} 
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.CHECKOUT(slug)); }} className="color-main"> {t('programDetail.tryAgain') || 'Thử lại'}</a>
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {(program.chief || program.authorImage) && (
                <div className="widget widget_instructor text-center p-4 mt-4 bordered">
                  <h4 className="widget-title">{t('programDetail.instructor') || 'Giảng Viên'}</h4>
                  <img src={(program.chief?.image || program.authorImage).startsWith('http') ? (program.chief?.image || program.authorImage) : `${import.meta.env.BASE_URL}${(program.chief?.image || program.authorImage).replace(/^\//, '')}`} alt={program.chief?.name || program.authorName} className="rounded-circle mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                  <h5>{program.chief?.name || program.authorName}</h5>
                  <p className="small-text color-main">{program.chief?.role || t('programDetail.masterChef') || 'Bếp Trưởng'}</p>
                  {program.chief && (
                    <div className="mt-3">
                      <Link to={ROUTES.CHIEF_DETAIL(program.chief.id)} className="btn btn-sm btn-outline-maincolor">{t('programDetail.viewProfile') || 'Xem Hồ Sơ'}</Link>
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

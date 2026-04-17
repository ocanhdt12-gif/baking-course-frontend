import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatPrice } from '../../utils/formatters';

const ProgramCard = ({ cls }) => {
  return (
    <div className="vertical-item text-center bordered">
      <div className="item-media" style={{ position: 'relative' }}>
        <img src={cls.thumbnail} alt="" style={{ objectFit: 'cover', width: '100%', aspectRatio: '4/3' }} />
        <div className="media-links">
          <Link className="abs-link" to={ROUTES.PROGRAM_DETAIL(cls.slug)}></Link>
        </div>
        {cls.programType && (
          <span className={`program-type-badge ${cls.programType === 'VIDEO_COURSE' ? 'video' : 'live'}`}>
            {cls.programType === 'VIDEO_COURSE' ? '🎬 Video' : '👨‍🍳 Trực tiếp'}
          </span>
        )}
        <div className="content-absolute bg-maincolor2-transparent text-left ds">
          <h6>{cls.authorName || cls.chief?.name}</h6>
          <div className={`autor ${cls.id === 1 ? 'half-circle' : ''}`}>
            <img src={cls.authorImage || cls.chief?.image} alt="" style={{ objectFit: 'cover', width: '70px', height: '70px', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
      <div className="item-content">
        <h5>
          <Link to={ROUTES.PROGRAM_DETAIL(cls.slug)}>{cls.title}</Link>
        </h5>
        <p>{cls.description}</p>
      </div>
      <div className="program-icon text-center">
        <div>
          <i className="fa fa-users color-main"></i>
          {cls.students}
        </div>
        <div>
          <i className="fa fa-comments color-main"></i>
          {cls.reviews}
        </div>
        <div>
          <i className="fa fa-money color-main"></i>
          {formatPrice(cls.price)}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;

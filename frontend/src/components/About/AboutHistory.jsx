import React from 'react';

const AboutHistory = ({ history }) => {
  return (
    <section className="ls s-py-75 s-py-lg-130 about">
      <div className="container">
        <div className="d-none d-lg-block divider-30"></div>
        <div className="row c-gutter-60">
          <div className="col-lg-6">
            <div className="item-content">
              <div className="section-heading">
                <h6 className="small-text color-main2">About us</h6>
                <h3>Muka History</h3>
              </div>
            </div>
            {history.historyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <ul className="list-styled style-2">
              {history.historyFeatures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="col-lg-6 border-none">
            <img src={`${import.meta.env.BASE_URL}images/about.jpg`} alt="" />
          </div>
        </div>
        <div className="d-none d-lg-block divider-15"></div>
      </div>
    </section>
  );
};

export default AboutHistory;

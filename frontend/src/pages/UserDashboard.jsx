import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Shared/PageTitle';
import { getMe } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe().then(setUser).catch(() => navigate('/auth'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <>
      <PageTitle 
        title="My Account"
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'My Account' }]}
      />
      <section className="ls s-py-60 s-py-lg-130">
        <div className="container">
          <div className="row">
            {/* Sidebar Profile */}
            <div className="col-lg-4">
              <div className="bordered text-center padding-small bg-white">
                <i className="fa fa-user-circle-o color-main2" style={{ fontSize: '80px', marginBottom: '20px' }}></i>
                <h4>{user.fullName}</h4>
                <p>{user.email}</p>
                <div className="divider-20"></div>
                <button onClick={handleLogout} className="btn btn-outline-maincolor">Logout</button>
              </div>
            </div>

            {/* Main Content: Enrollments */}
            <div className="col-lg-8 border">
              <h4 className="mt-4 mt-lg-0 mb-4">My Enrolled Classes</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Enrollment Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.enrollments?.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">You haven't enrolled in any classes yet.</td>
                      </tr>
                    ) : (
                      user.enrollments?.map(enroll => (
                        <tr key={enroll.id}>
                          <td>{enroll.program?.title || 'Unknown Class'}</td>
                          <td>{new Date(enroll.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${enroll.status === 'CONFIRMED' ? 'badge-success bg-success' : 'badge-warning bg-warning'}`}>
                              {enroll.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDashboard;

const AdminDashboard = () => {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Programs</h5>
              <p className="card-text display-4">12</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Enrollments</h5>
              <p className="card-text display-4">48</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Posts</h5>
              <p className="card-text display-4">24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

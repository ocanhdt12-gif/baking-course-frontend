import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminConfirmModal from './AdminConfirmModal';
import { getEnrollments, updateEnrollmentStatus, deleteEnrollment } from '../../services/api';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchEnrollments = async () => {
    try {
      const data = await getEnrollments();
      setEnrollments(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load enrollments", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'CONFIRMED' : 'PENDING';
    try {
      await updateEnrollmentStatus(id, newStatus);
      toast.success(`Status changed to ${newStatus}`);
      fetchEnrollments();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEnrollment(id);
      toast.success('Enrollment deleted successfully!');
      fetchEnrollments();
    } catch (err) {
      toast.error('Failed to delete enrollment');
    }
  };

  if (loading) return <div>Loading enrollments...</div>;

  return (
    <>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="mb-0">Course Enrollments</h3>
      </div>
      
      <div className="admin-paper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No enrollments found</td></tr>
            ) : (
              enrollments.map(enr => (
                <tr key={enr.id}>
                  <td>{new Date(enr.createdAt).toLocaleDateString()}</td>
                  <td>{enr.fullName}</td>
                  <td>{enr.email}</td>
                  <td>{enr.phone || 'N/A'}</td>
                  <td>
                    {enr.classSession?.program?.title || 'Unknown Course'}
                    <br/><small className="text-muted">{enr.classSession?.startDate ? new Date(enr.classSession.startDate).toLocaleDateString() : ''}</small>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        backgroundColor: enr.status === 'CONFIRMED' ? '#d4edda' : '#fff3cd',
                        color: enr.status === 'CONFIRMED' ? '#155724' : '#856404',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleStatusChange(enr.id, enr.status)}
                    >
                      {enr.status}
                    </span>
                  </td>
                  <td>
                    <button className="admin-btn-delete" onClick={() => setDeleteTargetId(enr.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    <AdminConfirmModal
      isOpen={!!deleteTargetId}
      onClose={() => setDeleteTargetId(null)}
      onConfirm={() => { handleDelete(deleteTargetId); setDeleteTargetId(null); }}
      title="Delete Enrollment"
      message="Are you sure you want to delete this enrollment? This action cannot be undone."
    />
    </>
  );
};

export default AdminEnrollments;

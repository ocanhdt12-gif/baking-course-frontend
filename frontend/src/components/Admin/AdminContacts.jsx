import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminConfirmModal from './AdminConfirmModal';
import { getContacts, deleteContact } from '../../services/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load contacts", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      toast.success('Contact deleted successfully!');
      fetchContacts();
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="mb-0">Contact Messages</h3>
      </div>
      
      <div className="admin-paper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No messages found</td></tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td>{contact.fullName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject || 'No Subject'}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={contact.message}>
                    {contact.message}
                  </td>
                  <td>
                    <button className="admin-btn-delete" onClick={() => setDeleteTargetId(contact.id)}>Delete</button>
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
      title="Delete Contact"
      message="Are you sure you want to delete this contact message? This action cannot be undone."
    />
    </>
  );
};

export default AdminContacts;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminConfirmModal from './AdminConfirmModal';
import AdminButton from './Shared/AdminButton';
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
      console.error("Lỗi khi tải danh sách tin nhắn", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      toast.success('Xóa tin nhắn thành công!');
      fetchContacts();
    } catch (err) {
      toast.error('Lỗi khi xóa tin nhắn');
    }
  };

  if (loading) return <div>Đang tải tin nhắn...</div>;

  return (
    <>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="mb-0">Tin nhắn Liên hệ</h3>
      </div>
      
      <div className="admin-paper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Chủ đề</th>
              <th>Nội dung</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="6" className="text-center">Chưa có tin nhắn nào</td></tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td>{contact.fullName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject || 'Không có chủ đề'}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={contact.message}>
                    {contact.message}
                  </td>
                  <td>
                    <AdminButton variant="danger" icon="trash" outline size="sm" onClick={() => setDeleteTargetId(contact.id)} />
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
      title="Xóa Tin nhắn"
      message="Bạn có chắc chắn muốn xóa tin nhắn liên hệ này? Hành động này không thể hoàn tác."
    />
    </>
  );
};

export default AdminContacts;

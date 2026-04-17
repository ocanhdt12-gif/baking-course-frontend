import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import AdminButton from './Shared/AdminButton';
import { AdminInput, AdminTextarea } from './Shared/AdminFormControls';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/api';
import { toast } from 'react-toastify';

const AdminTestimonials = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, item: null });

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    excerpt: '',
    text: '',
    signature: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setData(res);
    } catch {
      toast.error('Lỗi khi tải dữ liệu đánh giá.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (item = null) => {
    setModalState({ isOpen: true, item });
    if (item) {
      setFormData({
        name: item.name,
        role: item.role,
        excerpt: item.excerpt,
        text: item.text,
        signature: item.signature || ''
      });
    } else {
      setFormData({
        name: '',
        role: '',
        excerpt: '',
        text: '',
        signature: ''
      });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, item: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalState.item) {
        await updateTestimonial(modalState.item.id, formData);
        toast.success('Cập nhật đánh giá thành công!');
      } else {
        await createTestimonial(formData);
        toast.success('Thêm đánh giá thành công!');
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error('Lỗi lưu đánh giá.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await deleteTestimonial(id);
        toast.success("Xóa thành công!");
        fetchData();
      } catch {
        toast.error("Lỗi khi xóa đánh giá.");
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Tên Học Viên' },
    { key: 'role', label: 'Vai Trò / Chức Dự' },
    { key: 'excerpt', label: 'Trích Dẫn', render: (row) => row.excerpt ? <span title={row.excerpt}>{row.excerpt.substring(0, 40)}...</span> : '—' },
    { key: 'createdAt', label: 'Ngày Tạo', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—' }
  ];



  return (
    <div>
      <AdminTable 
        title={<span><i className="fa fa-quote-left mr-2"></i> Quản lý Đánh Giá (Testimonials)</span>}
        columns={columns} 
        data={data} 
        loading={loading} 
        onEdit={openModal}
        onDelete={handleDelete}
        emptyMessage="Chưa có đánh giá nào. Thêm một số đánh giá để hiển thị trên trang chủ!"
        onCreate={() => openModal()}
      />

      <AdminModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.item ? 'Sửa Đánh Giá' : 'Thêm Đánh Giá'}
      >
        <form id="admin-testimonial-form" onSubmit={handleSave}>
          <div className="row">
            <div className="col-md-6">
              <AdminInput 
                label="Tên người đánh giá" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="col-md-6">
              <AdminInput 
                label="Vai trò hoặc Nghề nghiệp" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                placeholder="VD: Học viên, Nhà phê bình Ẩm thực"
                required 
              />
            </div>
          </div>
          <AdminInput 
            label="Đoạn trích ngắn (Hiển thị thẻ card)" 
            value={formData.excerpt} 
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
            required 
          />
          <AdminTextarea 
            label="Nội dung đầy đủ" 
            value={formData.text} 
            onChange={(e) => setFormData({...formData, text: e.target.value})} 
            rows="4" 
            required 
          />
          <AdminInput 
            label="Chữ ký (Tùy chọn)" 
            value={formData.signature} 
            onChange={(e) => setFormData({...formData, signature: e.target.value})} 
          />
          
          <div className="mt-4 text-right">
            <AdminButton variant="secondary" onClick={closeModal} label="Hủy" className="mr-2" />
            <AdminButton type="submit" variant="primary" icon="save" label="Lưu Đánh Giá" />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminTestimonials;

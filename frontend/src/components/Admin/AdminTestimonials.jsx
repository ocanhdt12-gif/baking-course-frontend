import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
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
      toast.error('Could not load testimonials.');
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
        toast.success('Testimonial updated!');
      } else {
        await createTestimonial(formData);
        toast.success('Testimonial added!');
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error('Failed to save testimonial.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
        toast.success("Deleted successfully!");
        fetchData();
      } catch {
        toast.error("Failed to delete testimonial.");
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Reviewer Name' },
    { key: 'role', label: 'Role/Title' },
    { key: 'excerpt', label: 'Excerpt', render: (row) => row.excerpt ? <span title={row.excerpt}>{row.excerpt.substring(0, 40)}...</span> : '—' },
    { key: 'createdAt', label: 'Created At', render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—' }
  ];



  return (
    <div>
      <AdminTable 
        title={<span><i className="fa fa-quote-left mr-2"></i> Manage Testimonials</span>}
        columns={columns} 
        data={data} 
        loading={loading} 
        onEdit={openModal}
        onDelete={handleDelete}
        emptyMessage="No testimonials found. Add some to show on the homepage!"
        onCreate={() => openModal()}
      />

      <AdminModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.item ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form id="admin-testimonial-form" onSubmit={handleSave}>
          <div className="row">
            <div className="col-md-6">
              <AdminInput 
                label="Reviewer Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="col-md-6">
              <AdminInput 
                label="Role or Identity" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                placeholder="e.g. Student, Food Critic"
                required 
              />
            </div>
          </div>
          <AdminInput 
            label="Short Excerpt (Displayed on Cards)" 
            value={formData.excerpt} 
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
            required 
          />
          <AdminTextarea 
            label="Full Review Text" 
            value={formData.text} 
            onChange={(e) => setFormData({...formData, text: e.target.value})} 
            rows="4" 
            required 
          />
          <AdminInput 
            label="Signature Name (Optional)" 
            value={formData.signature} 
            onChange={(e) => setFormData({...formData, signature: e.target.value})} 
          />
          
          <div className="mt-4 text-right">
            <button type="button" className="btn btn-secondary mr-2" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-maincolor">Save Testimonial</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminTestimonials;

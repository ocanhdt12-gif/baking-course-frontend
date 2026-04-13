import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import AdminImageUpload from './AdminImageUpload';
import { AdminInput, AdminTextarea } from './Shared/AdminFormControls';
import { getChiefs, createChief, updateChief, deleteChief } from '../../services/api';
import { toast } from 'react-toastify';

const EMPTY_FORM = {
  name: '', role: '', image: '',
  bio: '', biography: '',
  highlights: '',
  socialFb: '', socialTw: '', socialIn: '',
  skills: [{ name: '', percent: 80 }]
};

const AdminChiefs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, item: null });
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getChiefs();
      setData(res.data || res || []);
    } catch { toast.error('Could not load chiefs.'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (item = null) => {
    setModal({ isOpen: true, item });
    if (item) {
      let skills = [{ name: '', percent: 80 }];
      try { skills = item.skills ? JSON.parse(item.skills) : skills; } catch {}
      setForm({ ...EMPTY_FORM, ...item, skills });
    } else {
      setForm(EMPTY_FORM);
    }
  };

  const closeModal = () => setModal({ isOpen: false, item: null });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Skills row management
  const addSkill = () => setForm({ ...form, skills: [...form.skills, { name: '', percent: 80 }] });
  const removeSkill = (i) => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });
  const updateSkill = (i, field, val) => {
    const updated = form.skills.map((s, idx) => idx === i ? { ...s, [field]: field === 'percent' ? parseInt(val) : val } : s);
    setForm({ ...form, skills: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, skills: JSON.stringify(form.skills) };
      if (modal.item) {
        await updateChief(modal.item.id, payload);
        toast.success('Instructor updated!');
      } else {
        await createChief(payload);
        toast.success('Instructor added!');
      }
      closeModal();
      fetchData();
    } catch { toast.error('Failed to save instructor.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this instructor?')) return;
    try {
      await deleteChief(id);
      toast.success('Deleted!');
      fetchData();
    } catch { toast.error('Failed to delete.'); }
  };

  const columns = [
    { key: 'image', label: 'Photo', render: (row) => row.image ? <img src={row.image.startsWith('http') ? row.image : `/${row.image}`} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> : <span style={{color:'#64748b'}}>No image</span> },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'bio', label: 'Short Bio', render: (row) => row.bio ? row.bio.substring(0, 50) + '...' : '—' },
  ];



  return (
    <div>
      <AdminTable 
        title={<span><i className="fa fa-users mr-2"></i> Manage Instructors</span>}
        columns={columns} 
        data={data} 
        loading={loading} 
        onEdit={openModal}
        onDelete={handleDelete}
        emptyMessage="No instructors yet." 
        onCreate={() => openModal()}
      />

      <AdminModal isOpen={modal.isOpen} onClose={closeModal} title={modal.item ? 'Edit Instructor' : 'Add Instructor'}>
        <form onSubmit={handleSave} style={{ maxHeight: '75vh', overflowY: 'auto', padding: '0 4px' }}>

          {/* Photo + Basic */}
          <div className="row">
            <div className="col-md-6">
              <AdminInput label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <AdminInput label="Role / Title" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Master Chef" required />
            </div>
          </div>

          <AdminImageUpload label="Profile Photo" name="image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <AdminTextarea label="Short Bio (Intro)" name="bio" value={form.bio} onChange={handleChange} rows="2" placeholder="1-2 lines of introduction displayed on the card..." />

          <AdminInput
            label="Highlights (separated by |)"
            name="highlights"
            value={form.highlights}
            onChange={handleChange}
            placeholder="Award-winning chef | Expert in French Pastry | 10+ years teaching"
          />

          <AdminTextarea label="Full Biography (Tab Detail)" name="biography" value={form.biography} onChange={handleChange} rows="5" placeholder="Detailed biography displayed in the Biography Tab..." />

          {/* Social */}
          <div className="row mt-2">
            <div className="col-md-4">
              <AdminInput label="Facebook URL" name="socialFb" value={form.socialFb} onChange={handleChange} placeholder="https://fb.com/..." />
            </div>
            <div className="col-md-4">
              <AdminInput label="Twitter URL" name="socialTw" value={form.socialTw} onChange={handleChange} placeholder="https://twitter.com/..." />
            </div>
            <div className="col-md-4">
              <AdminInput label="Instagram URL" name="socialIn" value={form.socialIn} onChange={handleChange} placeholder="https://instagram.com/..." />
            </div>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label style={{ color: 'var(--admin-primary)', fontWeight: 600 }}>Skills (Progress Bars)</label>
              <button type="button" className="btn btn-sm btn-outline-info" onClick={addSkill}>+ Add Skill</button>
            </div>
            {form.skills.map((skill, i) => (
              <div key={i} className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
                <input
                  className="admin-form-control"
                  style={{ flex: 2 }}
                  placeholder="Skill name (e.g. Pastry)"
                  value={skill.name}
                  onChange={(e) => updateSkill(i, 'name', e.target.value)}
                />
                <input
                  type="number" min="0" max="100"
                  className="admin-form-control"
                  style={{ flex: 1 }}
                  placeholder="%"
                  value={skill.percent}
                  onChange={(e) => updateSkill(i, 'percent', e.target.value)}
                />
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSkill(i)}><i className="fa fa-trash"></i></button>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right">
            <button type="button" className="btn btn-secondary mr-2" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-maincolor">Save Instructor</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminChiefs;

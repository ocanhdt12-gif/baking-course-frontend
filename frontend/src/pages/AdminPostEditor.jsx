import { useInitOnLoaded } from '../hooks/useInitOnLoaded';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostBySlug, createPost, updatePost, getPostCategories } from '../services/api';
import { toast } from 'react-toastify';
import AdminImageUpload from '../components/Admin/AdminImageUpload';
import { ROUTES } from '../constants/routes';

const AdminPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', slug: '', category: '', type: 'BLOG', thumbnail: '', authorName: 'Admin', dateString: '', content: '', desc: ''
  });

  useEffect(() => {
    // We add 'admin-mode' body class since this is a full page component replacing AdminDashboard wrapper
    document.body.classList.add('admin-mode');
    
    getPostCategories()
      .then(res => setCategories(res))
      .catch(() => console.error("Could not load categories"));

    if (isEditing) {
      getPostBySlug(id)
        .then(post => {
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            category: post.category || '',
            type: post.type || 'BLOG',
            thumbnail: post.thumbnail || '',
            authorName: post.authorName || 'Admin',
            dateString: post.dateString || '',
            content: post.content || '',
            desc: post.desc || ''
          });
          setLoading(false);
        })
        .catch(err => {
          toast.error("Lỗi khi tải bài viết");
          setLoading(false);
        });
    }

    return () => document.body.classList.remove('admin-mode');
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (newCat) payload.category = newCat;

      if (isEditing) {
        await updatePost(id, payload);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await createPost(payload);
        toast.success("Tạo bài viết thành công!");
      }
      navigate(ROUTES.ADMIN + "#posts");
    } catch (err) {
      toast.error("Lỗi lưu bài viết");
    }
  };

  useInitOnLoaded(loading);

  if (loading) return <div className="p-5 text-center text-white">Đang tải biểu mẫu...</div>;

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <div className="admin-paper-header" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, padding: '15px 30px', backgroundColor: 'var(--admin-paper-bg)', borderBottom: '1px solid var(--admin-border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="d-flex align-items-center">
          <button className="btn btn-dark mr-3" onClick={() => navigate(ROUTES.ADMIN + "#posts")}>
            <i className="fa fa-arrow-left"></i> Quay lại
          </button>
          <h4 style={{ margin: 0 }}>{isEditing ? 'Sửa Bài Viết' : 'Tạo Bài Viết Mới'}</h4>
        </div>
        <div>
          <button type="submit" form="admin-post-form" className="admin-btn-save">
            <i className="fa fa-save mr-2"></i> Lưu Bài Viết
          </button>
        </div>
      </div>

      <div className="container-fluid p-4" style={{ flexGrow: 1 }}>
        <form id="admin-post-form" onSubmit={handleSave} className="row h-100">
          
          {/* LEFT: EDITOR FORM */}
          <div className="col-lg-6 mb-4">
            <div className="admin-paper h-100 w-100 p-4">
              <h5 className="mb-4" style={{borderBottom: '1px solid #334155', paddingBottom: '10px'}}>Trình Soạn Thảo</h5>
              
              <div className="admin-form-group">
                <label>Tiêu đề <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="admin-form-control input-lg"
                  placeholder="Nhập tiêu đề bài viết..."
                  style={{ fontSize: '18px', fontWeight: 'bold' }}
                  required
                  minLength={5}
                />
                <small className="form-text mt-1 text-muted">
                   Đường dẫn (slug) sẽ tự động tạo khi lưu. Slug hiện tại: <strong>{formData.slug || 'Chưa có'}</strong>
                </small>
              </div>

              <div className="row mt-4">
                <div className="col-md-6 admin-form-group">
                  <label>Loại</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="admin-form-control">
                    <option value="BLOG">Bài Viết Blog</option>
                    <option value="RECIPE">Công Thức</option>
                  </select>
                </div>
                <div className="col-md-6 admin-form-group">
                  <label>Chuyên mục</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="admin-form-control mb-2">
                    <option value="">-- Chọn có sẵn --</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" value={newCat} onChange={e => setNewCat(e.target.value)} className="admin-form-control" placeholder="Hoặc nhập chuyên mục mới..." />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 admin-form-group">
                  <label>Tên Tác Giả</label>
                  <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} className="admin-form-control" />
                </div>
                <div className="col-md-6 admin-form-group">
                  <label>Ngày Hiển Thị</label>
                  <input type="text" name="dateString" value={formData.dateString} onChange={handleChange} className="admin-form-control" placeholder="12 Thg 8, 2026" />
                </div>
              </div>

              <div className="mt-3">
                <AdminImageUpload
                  label="Ảnh Đại Diện"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                />
              </div>

              <div className="admin-form-group mt-3">
                <label>Mô tả ngắn</label>
                <textarea name="desc" value={formData.desc} onChange={handleChange} className="admin-form-control" rows="3" placeholder="Đoạn trích giới thiệu..."></textarea>
              </div>

              <div className="admin-form-group mt-3 flex-grow-1 d-flex flexDirection-column">
                <label>Nội dung chi tiết <span className="text-danger">*</span></label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange} 
                  className="admin-form-control"
                  style={{ minHeight: '300px', fontFamily: 'monospace', lineHeight: '1.6' }} 
                  placeholder="<p>Viết nội dung bài viết HTML tại đây...</p>"
                  required
                  minLength={50}
                ></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="col-lg-6 mb-4">
            <div className="admin-paper h-100 w-100 p-0 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="p-3" style={{ borderBottom: '1px solid #334155', backgroundColor: '#1e293b' }}>
                <h5 className="m-0"><i className="fa fa-eye mr-2"></i> Xem Trước</h5>
              </div>
              
              <div className="preview-container p-4" style={{ backgroundColor: '#fff', color: '#333', flexGrow: 1, overflowY: 'auto' }}>
                {/* Simulated Blog Post View */}
                {formData.thumbnail && (
                  <img src={formData.thumbnail.startsWith('http') ? formData.thumbnail : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${formData.thumbnail}`} alt="" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '4px', marginBottom: '20px' }} />
                )}
                
                <div style={{ color: '#eb5e43', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', marginBottom: '10px' }}>
                  {formData.category || 'CHUYÊN MỤC'} • {formData.dateString || 'MỚI NHẤT'}
                </div>
                
                <h1 style={{ fontSize: '28px', color: '#222', marginBottom: '15px' }}>
                  {formData.title || 'Bài viết chưa có tiêu đề'}
                </h1>
                
                <div style={{ fontStyle: 'italic', color: '#666', borderLeft: '4px solid #eb5e43', paddingLeft: '15px', marginBottom: '25px', fontSize: '16px' }}>
                  {formData.desc || 'Đoạn chú thích sẽ xuất hiện tại đây...'}
                </div>

                <div className="content-preview" dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-muted">Nội dung sẽ xuất hiện tại đây...</p>' }} />
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminPostEditor;

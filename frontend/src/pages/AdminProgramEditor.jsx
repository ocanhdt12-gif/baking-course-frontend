import { useInitOnLoaded } from '../hooks/useInitOnLoaded';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgramBySlug, createProgram, updateProgram, getChiefs } from '../services/api';
import { toast } from 'react-toastify';
import AdminImageUpload from '../components/Admin/AdminImageUpload';
import { AdminInput, AdminSelect, AdminTextarea } from '../components/Admin/Shared/AdminFormControls';
import { ROUTES } from '../constants/routes';
import { priceToDollars, dollarsToCents } from '../utils/formatters';

const AdminProgramEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    programType: 'LIVE_CLASS',
    authorName: '', authorImage: '', chiefId: '',
    learningGoals: [], classIncludes: [], curriculum: [], classSessions: [],
    premiumContent: { videos: [], resources: [], guides: '' }
  });

  const [chiefsList, setChiefsList] = useState([]);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    
    getChiefs().then(res => {
      setChiefsList(res.data || res || []);
    }).catch(err => console.error("Failed to load chiefs", err));

    if (isEditing) {
      // getProgramByIdOrSlug supports both
      getProgramBySlug(id)
        .then(prog => {
          setFormData({
            programType: prog.programType || 'LIVE_CLASS',
            title: prog.title || '',
            slug: prog.slug || '',
            description: prog.description || '',
            price: prog.price != null ? priceToDollars(prog.price) : '',
            thumbnail: prog.thumbnail || '',
            chiefId: prog.chiefId || '',
            authorName: prog.authorName || '',
            authorImage: prog.authorImage || '',
            learningGoals: Array.isArray(prog.learningGoals) ? prog.learningGoals.map(g => typeof g === 'string' ? { skill: g, percent: 50 } : g) : [],
            classIncludes: Array.isArray(prog.classIncludes) ? prog.classIncludes : [],
            curriculum: Array.isArray(prog.curriculum) ? prog.curriculum : [],
            classSessions: Array.isArray(prog.classSessions) ? prog.classSessions.map(cs => ({
              ...cs,
              startDate: cs.startDate ? new Date(cs.startDate).toISOString().slice(0, 16) : '',
              endDate: cs.endDate ? new Date(cs.endDate).toISOString().slice(0, 16) : '',
              enrollmentDeadline: cs.enrollmentDeadline ? new Date(cs.enrollmentDeadline).toISOString().slice(0, 16) : ''
            })) : [],
            premiumContent: prog.premiumContent || { videos: [], resources: [], guides: '' }
          });
          setLoading(false);
        })
        .catch(err => {
          toast.error("Lỗi khi tải dữ liệu khóa học");
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
      const payload = {
        ...formData,
        price: formData.price ? dollarsToCents(formData.price) : null
      };
      if (isEditing) {
        await updateProgram(id, payload);
        toast.success("Cập nhật khóa học thành công!");
      } else {
        await createProgram(payload);
        toast.success("Tạo khóa học thành công!");
      }
      navigate(ROUTES.ADMIN + "#programs");
    } catch (err) {
      toast.error("Lỗi lưu khóa học");
    }
  };

  // --- Dynamic Array Handlers --- //
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...formData[field]];
    if (key) updated[index][key] = value;
    else updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const removeArrayItem = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData({ ...formData, [field]: updated });
  };

  const addLearningGoal = () => {
    setFormData({ ...formData, learningGoals: [...formData.learningGoals, { skill: '', percent: 0 }] });
  };

  const addClassInclude = () => {
    setFormData({ ...formData, classIncludes: [...formData.classIncludes, ''] });
  };

  const addCurriculum = () => {
    setFormData({ ...formData, curriculum: [...formData.curriculum, { title: '', content: '' }] });
  };

  const addClassSession = () => {
    setFormData({ ...formData, classSessions: [...formData.classSessions, { startDate: '', endDate: '', enrollmentDeadline: '', dayOfWeek: '', timeRange: '', instructorOverride: '' }] });
  };

  useInitOnLoaded(loading);

  if (loading) return <div className="p-5 text-center text-white">Đang tải dữ liệu...</div>;

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <div className="admin-paper-header" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, padding: '15px 30px', backgroundColor: 'var(--admin-paper-bg)', borderBottom: '1px solid var(--admin-border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="d-flex align-items-center">
          <button className="btn btn-dark mr-3" onClick={() => navigate(ROUTES.ADMIN + "#programs")}>
            <i className="fa fa-arrow-left"></i> Quay lại
          </button>
          <h4 style={{ margin: 0 }}>{isEditing ? 'Sửa Khóa Học' : 'Tạo Khóa Học Mới'}</h4>
        </div>
        <div>
          <button type="submit" form="admin-program-form" className="admin-btn-save">
            <i className="fa fa-save mr-2"></i> Lưu Khóa Học
          </button>
        </div>
      </div>

      <form id="admin-program-form" onSubmit={handleSave} className="container p-4" style={{ flexGrow: 1, maxWidth: '1000px' }}>
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-4" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Thông tin chung</h5>
          
          <AdminInput 
            label={<>Tên Khóa Học <span className="text-danger">*</span></>} 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Làm Bánh Ngọt Pháp Cơ Bản..."
            required
            minLength={5}
          />

          <div className="row mt-3">
            <div className="col-md-6">
              <AdminInput label={<>Giá (đ) <span className="text-danger">*</span></>} name="price" type="number" step="1000" min="0" value={formData.price} onChange={handleChange} placeholder="500000" required />
            </div>
            <div className="col-md-6">
              <AdminSelect 
                label={<>Giảng viên <span className="text-danger">*</span></>} 
                name="chiefId" 
                value={formData.chiefId} 
                onChange={handleChange}
                options={[
                  { value: '', label: '-- Chọn Giảng viên --' },
                  ...chiefsList.map(c => ({ value: c.id, label: c.name }))
                ]}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12">
              <AdminSelect 
                label={<>Loại sản phẩm <span className="text-danger">*</span></>} 
                name="programType" 
                value={formData.programType} 
                onChange={handleChange}
                options={[
                  { value: 'LIVE_CLASS', label: '👨‍🍳 Lớp học trực tiếp (Có lịch, Zoom/Offline)' },
                  { value: 'VIDEO_COURSE', label: '🎬 Khóa học Video (Xem mọi lúc, mọi nơi)' }
                ]}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-12">
              <AdminImageUpload label="Ảnh Đại Diện (Thumbnail)" name="thumbnail" value={formData.thumbnail} onChange={(url) => setFormData({ ...formData, thumbnail: url })} />
            </div>
          </div>

          <AdminTextarea 
            label={<>Mô tả tổng quát <span className="text-danger">*</span></>} 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Nhập thông tin khóa học..."
            required
            minLength={20}
          />
        </div>

        {formData.programType === 'LIVE_CLASS' && (
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-4" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Lịch học & Ngày khai giảng</h5>
          <p className="text-muted"><small>Thêm các lịch học cụ thể. Học viên sẽ chọn lịch này khi đăng ký ghi danh.</small></p>
          
          {formData.classSessions.map((session, i) => (
            <div key={i} className="mt-4 p-4 position-relative" style={{ backgroundColor: 'var(--admin-glass-bg)', borderRadius: '12px', border: '1px solid var(--admin-glass-border)', transition: 'all 0.3s' }}>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{borderBottom: '1px solid var(--admin-glass-border)'}}>
                <h6 className="m-0" style={{ color: 'var(--admin-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-calendar-check-o"></i> Lịch học #{i + 1}
                </h6>
                <button type="button" className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => removeArrayItem('classSessions', i)}>
                  <i className="fa fa-trash mr-1"></i> Xóa
                </button>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <AdminInput label={<>Ngày khai giảng <span className="text-danger">*</span></>} type="datetime-local" value={session.startDate} onChange={e => handleArrayChange('classSessions', i, 'startDate', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <AdminInput label={<>Ngày kết thúc <span className="text-danger">*</span></>} type="datetime-local" value={session.endDate} onChange={e => handleArrayChange('classSessions', i, 'endDate', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <AdminInput label="Hạn chót đăng ký" type="datetime-local" value={session.enrollmentDeadline} onChange={e => handleArrayChange('classSessions', i, 'enrollmentDeadline', e.target.value)} />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-4">
                  <AdminSelect 
                    label={<>Ngày trong tuần <span className="text-danger">*</span></>} 
                    value={session.dayOfWeek} 
                    onChange={e => handleArrayChange('classSessions', i, 'dayOfWeek', e.target.value)}
                    required 
                    options={[
                      {label: '- Chọn ngày -', value: ''},
                      {label: 'Thứ Hai', value: 'Monday'},
                      {label: 'Thứ Ba', value: 'Tuesday'},
                      {label: 'Thứ Tư', value: 'Wednesday'},
                      {label: 'Thứ Năm', value: 'Thursday'},
                      {label: 'Thứ Sáu', value: 'Friday'},
                      {label: 'Thứ Bảy', value: 'Saturday'},
                      {label: 'Chủ Nhật', value: 'Sunday'}
                    ]}
                  />
                </div>
                <div className="col-md-4">
                  <AdminInput label="Giờ học" value={session.timeRange} onChange={e => handleArrayChange('classSessions', i, 'timeRange', e.target.value)} placeholder="VD: 10:00 AM - 12:00 PM" />
                </div>
                <div className="col-md-4">
                  <AdminInput label="Ghi chú Giảng viên" value={session.instructorOverride || ''} onChange={e => handleArrayChange('classSessions', i, 'instructorOverride', e.target.value)} placeholder="Giảng viên khác dạy thay" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-info rounded-pill px-4 mt-4" style={{ fontWeight: '600', letterSpacing: '0.5px' }} onClick={addClassSession}>
            <i className="fa fa-plus mr-2"></i> Thêm Lịch học
          </button>
        </div>
        )}

        {/* JSON ARRAY: Learning Goals */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-2" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Mục tiêu khóa học (Thanh Kỹ Năng)</h5>
          {formData.learningGoals.map((goal, i) => (
            <div key={i} className="row mt-2 align-items-center mb-2">
              <div className="col-7">
                <input className="admin-form-control shadow-none" value={goal.skill || ''} onChange={e => handleArrayChange('learningGoals', i, 'skill', e.target.value)} placeholder="Tên kỹ năng" />
              </div>
              <div className="col-3">
                <input className="admin-form-control shadow-none" type="number" value={goal.percent || ''} onChange={e => handleArrayChange('learningGoals', i, 'percent', parseInt(e.target.value) || 0)} placeholder="%" min="0" max="100" />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => removeArrayItem('learningGoals', i)}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={addLearningGoal}>+ Thêm Kỹ Năng</button>
        </div>

        {/* JSON ARRAY: Class Includes */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-2" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Lợi ích khóa học</h5>
          {formData.classIncludes.map((item, i) => (
            <div key={i} className="row mt-2 align-items-center">
              <div className="col-10">
                <AdminInput value={item} onChange={e => handleArrayChange('classIncludes', i, null, e.target.value)} placeholder="Nội dung..." />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => removeArrayItem('classIncludes', i)}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={addClassInclude}>+ Thêm Lợi Ích</button>
        </div>

        {/* JSON ARRAY: Curriculum */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-2" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Chương Trình Học (Curriculum)</h5>
          {formData.curriculum.map((mod, i) => (
            <div key={i} className="mt-3 p-3 position-relative" style={{ backgroundColor: 'var(--admin-glass-bg)', borderRadius: '12px', border: '1px solid var(--admin-glass-border)' }}>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-2" style={{borderColor: 'var(--admin-glass-border)'}}>
                <label style={{ color: 'var(--admin-primary)', fontWeight: '600', margin: 0 }}>Chương {i + 1}</label>
                <button type="button" className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => removeArrayItem('curriculum', i)}><i className="fa fa-trash"></i></button>
              </div>
              <AdminInput value={mod.title} onChange={e => handleArrayChange('curriculum', i, 'title', e.target.value)} placeholder="Tiêu đề chương" required />
              <AdminTextarea value={mod.content} onChange={e => handleArrayChange('curriculum', i, 'content', e.target.value)} rows="2" placeholder="Nội dung chương học..." required minLength={10} />
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={addCurriculum}>+ Thêm Chương Mới</button>
        </div>

        {/* Premium Content Section */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-4" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>
            <i className="fa fa-star mr-2" style={{color: '#c19a5b'}}></i> Nội Dung Private (Premium)
            <small className="text-muted ml-2">(Chỉ hiển thị cho người dùng đã làm lễ mua khóa học)</small>
          </h5>

          {/* Videos */}
          <h6 className="mb-2">Video Bài Giảng</h6>
          {(formData.premiumContent?.videos || []).map((video, i) => (
            <div key={i} className="row mt-2 align-items-center">
              <div className="col-5">
                <AdminInput value={video.title || ''} onChange={e => {
                  const updated = [...(formData.premiumContent?.videos || [])];
                  updated[i] = { ...updated[i], title: e.target.value };
                  setFormData({ ...formData, premiumContent: { ...formData.premiumContent, videos: updated } });
                }} placeholder="Tiêu đề video" />
              </div>
              <div className="col-5">
                <AdminInput value={video.url || ''} onChange={e => {
                  const updated = [...(formData.premiumContent?.videos || [])];
                  updated[i] = { ...updated[i], url: e.target.value };
                  setFormData({ ...formData, premiumContent: { ...formData.premiumContent, videos: updated } });
                }} placeholder="Link nhúng Youtube/Vimeo/GoogleDrive" />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => {
                  const updated = [...(formData.premiumContent?.videos || [])];
                  updated.splice(i, 1);
                  setFormData({ ...formData, premiumContent: { ...formData.premiumContent, videos: updated } });
                }}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-2" onClick={() => {
            setFormData({ ...formData, premiumContent: { ...formData.premiumContent, videos: [...(formData.premiumContent?.videos || []), { title: '', url: '' }] } });
          }}>+ Thêm Video</button>

          {/* Resources */}
          <h6 className="mt-4 mb-2">Tài nguyên tải xuống</h6>
          {(formData.premiumContent?.resources || []).map((res, i) => (
            <div key={i} className="row mt-2 align-items-center">
              <div className="col-5">
                <AdminInput value={res.title || ''} onChange={e => {
                  const updated = [...(formData.premiumContent?.resources || [])];
                  updated[i] = { ...updated[i], title: e.target.value };
                  setFormData({ ...formData, premiumContent: { ...formData.premiumContent, resources: updated } });
                }} placeholder="Tên tài nguyên" />
              </div>
              <div className="col-5">
                <AdminInput value={res.url || ''} onChange={e => {
                  const updated = [...(formData.premiumContent?.resources || [])];
                  updated[i] = { ...updated[i], url: e.target.value };
                  setFormData({ ...formData, premiumContent: { ...formData.premiumContent, resources: updated } });
                }} placeholder="Link tải" />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => {
                  const updated = [...(formData.premiumContent?.resources || [])];
                  updated.splice(i, 1);
                  setFormData({ ...formData, premiumContent: { ...formData.premiumContent, resources: updated } });
                }}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-2" onClick={() => {
            setFormData({ ...formData, premiumContent: { ...formData.premiumContent, resources: [...(formData.premiumContent?.resources || []), { title: '', url: '' }] } });
          }}>+ Thêm Tài Nguyên</button>

          {/* Guides */}
          <h6 className="mt-4 mb-2">Hướng Dẫn Chi Tiết</h6>
          <AdminTextarea 
            value={formData.premiumContent?.guides || ''} 
            onChange={e => setFormData({ ...formData, premiumContent: { ...formData.premiumContent, guides: e.target.value } })}
            rows="4"
            placeholder="Nội dung hướng dẫn chi tiết (Hỗ trợ HTML)..."
          />
        </div>
      </form>
    </div>
  );
};

export default AdminProgramEditor;

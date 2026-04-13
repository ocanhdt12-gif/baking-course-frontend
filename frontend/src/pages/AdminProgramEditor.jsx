import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgramBySlug, createProgram, updateProgram, getChiefs } from '../services/api';
import { toast } from 'react-toastify';
import AdminImageUpload from '../components/Admin/AdminImageUpload';
import { AdminInput, AdminSelect, AdminTextarea } from '../components/Admin/Shared/AdminFormControls';
import { ROUTES } from '../constants/routes';

const AdminProgramEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    authorName: '', authorImage: '', chiefId: '',
    learningGoals: [], classIncludes: [], curriculum: [], classSessions: []
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
            title: prog.title || '',
            slug: prog.slug || '',
            description: prog.description || '',
            price: prog.price || '',
            thumbnail: prog.thumbnail || '',
            chiefId: prog.chiefId || '',
            authorName: prog.authorName || '',
            authorImage: prog.authorImage || '',
            learningGoals: Array.isArray(prog.learningGoals) ? prog.learningGoals : [],
            classIncludes: Array.isArray(prog.classIncludes) ? prog.classIncludes : [],
            curriculum: Array.isArray(prog.curriculum) ? prog.curriculum : [],
            classSessions: Array.isArray(prog.classSessions) ? prog.classSessions.map(cs => ({
              ...cs,
              startDate: cs.startDate ? new Date(cs.startDate).toISOString().slice(0, 16) : '',
              endDate: cs.endDate ? new Date(cs.endDate).toISOString().slice(0, 16) : '',
              enrollmentDeadline: cs.enrollmentDeadline ? new Date(cs.enrollmentDeadline).toISOString().slice(0, 16) : ''
            })) : []
          });
          setLoading(false);
        })
        .catch(err => {
          toast.error("Failed to load program");
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
      if (isEditing) {
        await updateProgram(id, formData);
        toast.success("Program updated successfully!");
      } else {
        await createProgram(formData);
        toast.success("Program created successfully!");
      }
      navigate(ROUTES.ADMIN + "#programs");
    } catch (err) {
      toast.error("Failed to save program");
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

  if (loading) return <div className="p-5 text-center text-white">Loading Editor...</div>;

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <div className="admin-paper-header" style={{ position: 'sticky', top: 0, zIndex: 100, borderRadius: 0, padding: '15px 30px', backgroundColor: 'var(--admin-paper-bg)', borderBottom: '1px solid var(--admin-border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="d-flex align-items-center">
          <button className="btn btn-dark mr-3" onClick={() => navigate(ROUTES.ADMIN + "#programs")}>
            <i className="fa fa-arrow-left"></i> Back
          </button>
          <h4 style={{ margin: 0 }}>{isEditing ? 'Edit Program' : 'Create New Program'}</h4>
        </div>
        <div>
          <button type="submit" form="admin-program-form" className="admin-btn-save">
            <i className="fa fa-save mr-2"></i> Save Program
          </button>
        </div>
      </div>

      <form id="admin-program-form" onSubmit={handleSave} className="container p-4" style={{ flexGrow: 1, maxWidth: '1000px' }}>
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-4" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>General Details</h5>
          
          <AdminInput 
            label={<>Program Title <span className="text-danger">*</span></>} 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Mastering French Pastries..."
            required
            minLength={5}
          />

          <div className="row mt-3">
            <div className="col-md-6">
              <AdminInput label={<>Price <span className="text-danger">*</span></>} name="price" value={formData.price} onChange={handleChange} placeholder="$550" required />
            </div>
            <div className="col-md-6">
              <AdminSelect 
                label={<>Instructor (Chief) <span className="text-danger">*</span></>} 
                name="chiefId" 
                value={formData.chiefId} 
                onChange={handleChange}
                options={[
                  { value: '', label: '-- Select Instructor --' },
                  ...chiefsList.map(c => ({ value: c.id, label: c.name }))
                ]}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-sm-12">
              <AdminImageUpload label="Thumbnail Image" name="thumbnail" value={formData.thumbnail} onChange={(url) => setFormData({ ...formData, thumbnail: url })} />
            </div>
          </div>

          <AdminTextarea 
            label={<>General Description <span className="text-danger">*</span></>} 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Brief program details..."
            required
            minLength={20}
          />
        </div>

        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-4" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Class Cohorts & Schedules</h5>
          <p className="text-muted"><small>Add specific class sessions (cohorts) for this program. These will appear in the main timetable and students will select them when enrolling.</small></p>
          
          {formData.classSessions.map((session, i) => (
            <div key={i} className="mt-4 p-4 position-relative" style={{ backgroundColor: 'var(--admin-glass-bg)', borderRadius: '12px', border: '1px solid var(--admin-glass-border)', transition: 'all 0.3s' }}>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{borderBottom: '1px solid var(--admin-glass-border)'}}>
                <h6 className="m-0" style={{ color: 'var(--admin-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-calendar-check-o"></i> Class Session #{i + 1}
                </h6>
                <button type="button" className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => removeArrayItem('classSessions', i)}>
                  <i className="fa fa-trash mr-1"></i> Remove
                </button>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <AdminInput label={<>Start Date <span className="text-danger">*</span></>} type="datetime-local" value={session.startDate} onChange={e => handleArrayChange('classSessions', i, 'startDate', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <AdminInput label={<>End Date <span className="text-danger">*</span></>} type="datetime-local" value={session.endDate} onChange={e => handleArrayChange('classSessions', i, 'endDate', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <AdminInput label="Enroll Deadline" type="datetime-local" value={session.enrollmentDeadline} onChange={e => handleArrayChange('classSessions', i, 'enrollmentDeadline', e.target.value)} />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-4">
                  <AdminSelect 
                    label={<>Day of Week <span className="text-danger">*</span></>} 
                    value={session.dayOfWeek} 
                    onChange={e => handleArrayChange('classSessions', i, 'dayOfWeek', e.target.value)}
                    required 
                    options={[
                      {label: '- Select Day -', value: ''},
                      {label: 'Monday', value: 'Monday'},
                      {label: 'Tuesday', value: 'Tuesday'},
                      {label: 'Wednesday', value: 'Wednesday'},
                      {label: 'Thursday', value: 'Thursday'},
                      {label: 'Friday', value: 'Friday'},
                      {label: 'Saturday', value: 'Saturday'},
                      {label: 'Sunday', value: 'Sunday'}
                    ]}
                  />
                </div>
                <div className="col-md-4">
                  <AdminInput label="Time Range" value={session.timeRange} onChange={e => handleArrayChange('classSessions', i, 'timeRange', e.target.value)} placeholder="e.g. 10:00 AM - 12:00 PM" />
                </div>
                <div className="col-md-4">
                  <AdminInput label="Instructor Override" value={session.instructorOverride || ''} onChange={e => handleArrayChange('classSessions', i, 'instructorOverride', e.target.value)} placeholder="Optional (leaves blank to use general)" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-info rounded-pill px-4 mt-4" style={{ fontWeight: '600', letterSpacing: '0.5px' }} onClick={addClassSession}>
            <i className="fa fa-plus mr-2"></i> Add Class Session
          </button>
        </div>

        {/* JSON ARRAY: Learning Goals */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-2" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>You Will Learn (Progress Bars)</h5>
          {formData.learningGoals.map((goal, i) => (
            <div key={i} className="row mt-2 align-items-center">
              <div className="col-7">
                <AdminInput value={goal.skill} onChange={e => handleArrayChange('learningGoals', i, 'skill', e.target.value)} placeholder="Skill Name" />
              </div>
              <div className="col-3">
                <AdminInput type="number" value={goal.percent} onChange={e => handleArrayChange('learningGoals', i, 'percent', parseInt(e.target.value))} placeholder="%" min="0" max="100" />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => removeArrayItem('learningGoals', i)}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={addLearningGoal}>+ Add Skill</button>
        </div>

        {/* JSON ARRAY: Class Includes */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-2" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Class Includes (Bullet Points)</h5>
          {formData.classIncludes.map((item, i) => (
            <div key={i} className="row mt-2 align-items-center">
              <div className="col-10">
                <AdminInput value={item} onChange={e => handleArrayChange('classIncludes', i, null, e.target.value)} placeholder="Bullet text..." />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-danger w-100" onClick={() => removeArrayItem('classIncludes', i)}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={addClassInclude}>+ Add Bullet</button>
        </div>

        {/* JSON ARRAY: Curriculum */}
        <div className="admin-paper p-4 mb-4">
          <h5 className="mb-2" style={{borderBottom: '1px solid var(--admin-border-light)', paddingBottom: '10px'}}>Curriculum Overview (Accordion)</h5>
          {formData.curriculum.map((mod, i) => (
            <div key={i} className="mt-3 p-3 position-relative" style={{ backgroundColor: 'var(--admin-glass-bg)', borderRadius: '12px', border: '1px solid var(--admin-glass-border)' }}>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-2" style={{borderColor: 'var(--admin-glass-border)'}}>
                <label style={{ color: 'var(--admin-primary)', fontWeight: '600', margin: 0 }}>Module {i + 1}</label>
                <button type="button" className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => removeArrayItem('curriculum', i)}><i className="fa fa-trash"></i></button>
              </div>
              <AdminInput value={mod.title} onChange={e => handleArrayChange('curriculum', i, 'title', e.target.value)} placeholder="Module Title" required />
              <AdminTextarea value={mod.content} onChange={e => handleArrayChange('curriculum', i, 'content', e.target.value)} rows="2" placeholder="Module Content..." required minLength={10} />
            </div>
          ))}
          <button type="button" className="btn btn-outline-info btn-sm mt-3" onClick={addCurriculum}>+ Add Module</button>
        </div>
      </form>
    </div>
  );
};

export default AdminProgramEditor;

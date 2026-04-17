import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTable from './AdminTable';
import { toast } from 'react-toastify';
import { getPrograms, deleteProgram } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import { formatPrice } from '../../utils/formatters';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await getPrograms();
    setPrograms(data.data || data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    navigate(ROUTES.ADMIN_PROGRAM_NEW);
  };

  const handleOpenEdit = (prog) => {
    navigate(ROUTES.ADMIN_PROGRAM_EDIT(prog.id));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram(id);
      toast.success('Program deleted successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete program');
    }
  };

  const columns = [
    { label: 'Thumb', render: (row) => <img src={row.thumbnail} alt="" width="50" style={{borderRadius: '4px'}}/> },
    { label: 'Title', key: 'title' },
    { label: 'Price', render: (row) => formatPrice(row.price) },
    { label: 'Author', key: 'authorName' },
    { label: 'Stats', render: (row) => {
      const studentCount = row.classSessions ? row.classSessions.reduce((acc, s) => acc + (s.enrollments?.length || 0), 0) : 0;
      return <small>{studentCount} stds / {row.reviews || 0} revs</small>;
    }},
    { label: 'Status', render: (row) => {
        if (!row.classSessions || row.classSessions.length === 0) return <span className="badge badge-secondary">DRAFT</span>;
        
        const now = new Date();
        const hasUpcoming = row.classSessions.some(cs => cs.startDate && new Date(cs.startDate) > now);
        const hasOngoing = row.classSessions.some(cs => cs.startDate && cs.endDate && new Date(cs.startDate) <= now && new Date(cs.endDate) >= now);
        
        if (hasOngoing) return <span className="badge badge-success">ONGOING</span>;
        if (hasUpcoming) return <span className="badge badge-warning text-dark">UPCOMING</span>;
        
        return <span className="badge badge-danger">COMPLETED</span>;
    }}
  ];

  return (
    <div>
      <AdminTable 
        title="Manage Programs" 
        columns={columns} 
        data={programs} 
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminPrograms;

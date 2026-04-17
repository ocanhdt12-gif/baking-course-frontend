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
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;
    try {
      await deleteProgram(id);
      toast.success('Xóa khóa học thành công!');
      fetchData();
    } catch (err) {
      toast.error('Lỗi khi xóa khóa học');
    }
  };

  const columns = [
    { label: 'Ảnh', render: (row) => <img src={row.thumbnail} alt="" width="50" style={{borderRadius: '4px'}}/> },
    { label: 'Tiêu đề', key: 'title' },
    { label: 'Giá', render: (row) => formatPrice(row.price) },
    { label: 'Giảng viên', render: (row) => row.authorName || row.chief?.name || 'Admin' },
    { label: 'Thống kê', render: (row) => {
      const studentCount = row.classSessions ? row.classSessions.reduce((acc, s) => acc + (s.enrollments?.length || 0), 0) : 0;
      return <small>{studentCount} học viên / {row.reviews || 0} đánh giá</small>;
    }},
    { label: 'Trạng thái', render: (row) => {
        if (!row.classSessions || row.classSessions.length === 0) return <span className="badge badge-secondary">BẢN NHÁP</span>;
        
        const now = new Date();
        const hasUpcoming = row.classSessions.some(cs => cs.startDate && new Date(cs.startDate) > now);
        const hasOngoing = row.classSessions.some(cs => cs.startDate && cs.endDate && new Date(cs.startDate) <= now && new Date(cs.endDate) >= now);
        
        if (hasOngoing) return <span className="badge badge-success">ĐANG DIỄN RA</span>;
        if (hasUpcoming) return <span className="badge badge-warning text-dark">SẮP DIỄN RA</span>;
        
        return <span className="badge badge-danger">ĐÃ KẾT THÚC</span>;
    }}
  ];

  return (
    <div>
      <AdminTable 
        title="Quản lý Khóa học" 
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

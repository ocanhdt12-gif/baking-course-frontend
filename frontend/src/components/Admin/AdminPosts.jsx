import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import AdminImageUpload from './AdminImageUpload';
import { toast } from 'react-toastify';
import { getPosts, deletePost } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await getPosts();
    setPosts(data.data || data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    navigate(ROUTES.ADMIN_POST_NEW);
  };

  const handleOpenEdit = (post) => {
    navigate(ROUTES.ADMIN_POST_EDIT(post.slug || post.id));
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success('Post deleted successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };



  const columns = [
    { label: 'Thumb', render: (row) => <img src={row.thumbnail} alt="" width="50" style={{borderRadius: '4px'}}/> },
    { label: 'Title', key: 'title' },
    { label: 'Category', render: (row) => <span className="badge badge-info bg-info">{row.category}</span> },
    { label: 'Author', key: 'authorName' },
    { label: 'Date', key: 'dateString' }
  ];

  return (
    <div>
      <AdminTable 
        title="Manage Posts & Recipes" 
        columns={columns} 
        data={posts} 
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />


    </div>
  );
};

export default AdminPosts;

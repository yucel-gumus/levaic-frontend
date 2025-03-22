import React from 'react';
import { useParams } from 'react-router-dom';
import BlogForm from '../../components/BlogForm';

const BlogEdit = () => {
  const { id } = useParams();
  return <BlogForm id={id} />;
};

export default BlogEdit; 
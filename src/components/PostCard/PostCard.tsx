import React from 'react'
import './PostCard.css'

interface PostCardProps {
  userId: number;
  id: number;
  title: string;
  body: string;
  onViewComments: (postId: number) => void;
  showComments: boolean;
  name: string
}



export default function PostCard({ userId, id, title, body, onViewComments, showComments, name }: PostCardProps) {
  return (
    <div className='w-full flex justify-center'>
      <div className='post-card'>
        <p className=''>ID: {id}</p>
        <p>Post's Title: {title}</p>
        <p className='mx-5 my-2'>{body}</p>
        <div className='w-full flex justify-between'>
          <p className='mt-5'>Posted by: {name}</p>

          <button 
            onClick={() => onViewComments(id)}
            className="button-search"
            >
            {showComments ? 'Hide Comments' : 'View Comments'}
          </button>
          </div>
      </div>
    </div>
  )
}


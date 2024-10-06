import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Popup from '../PopUp/Popup';
import './TaskCard.css'

interface TaskCard {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  onStatusChange: (id: number, completed: boolean) => void;
}

export default function TaskCard({ userId, id, title: initTitle, completed }: TaskCard) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initTitle);
  const [editedTitle, setEditedTitle] = useState(initTitle);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });
  const [isCompleted, setIsCompleted] = useState(completed);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isModalOpen]);

  const handleToggleCompleted = async () => {
    try {
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        completed: !isCompleted
      });
      
      if (response.status === 200) {
        setIsCompleted(!isCompleted);
        setPopupMessage({ content: "Task status updated successfully!", isShow: true });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setPopupMessage({ content: "Failed to update task status", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  const handleEdit = async () => {
    if (currentTitle === editedTitle) return;

    try {
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title: editedTitle,
        userId: userId
      });
      
      if (response.status === 200) {
        setCurrentTitle(editedTitle);
        setPopupMessage({ content: "Task edited successfully!", isShow: true });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
      } else {
        setPopupMessage({ content: "Task edit failed!", isShow: true });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
      }
    } catch (error) {
      console.error('Error editing task:', error);
      setPopupMessage({ content: "Error editing task", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      
      if (response.status === 200) {
        setPopupMessage({ content: "Task deleted successfully!", isShow: true });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
        setIsModalOpen(false);
      } else {
        setPopupMessage({ content: "Failed to delete task", isShow: true });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setPopupMessage({ content: "Error deleting task", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  return (
    <>
      <Popup content={popupMessage.content} isShow={popupMessage.isShow} />
      <div 
        className="w-full task-card mb-2 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            title='Complete'
            checked={isCompleted}
            onChange={handleToggleCompleted}
            className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            onClick={(e) => e.stopPropagation()}
          />
          <span className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {currentTitle}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="bg rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                title='aaa'
                checked={isCompleted}
                onChange={handleToggleCompleted}
                className="form-checkbox  h-5 w-5  mr-3"
              />
              <input
                ref={titleInputRef}
                title='aaa'
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleEdit}
                className="w-full bg-transparent text-white text-lg font-semibold focus:outline-none"
              />
            </div>
            <div className="flex justify-end items-center mt-4">
              <button
                onClick={handleDelete}
                className="button-search hover:bg-red-600 text-white mt-3 px-4 py-2 mr-2 rounded-sm"
              >
                Delete task
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="button-search"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
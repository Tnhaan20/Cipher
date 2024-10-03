import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AlbumCard.css";
import Popup from "../PopUp/Popup";
import axios from "axios";

interface AlbumProps {
  userId: number;
  id: number;
  title: string; 
  userName: string;
}


export default function AlbumCard({ userId, id, title: initTitle, userName }: AlbumProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initTitle);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });
  const [options, setOptions] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initTitle);

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOptions(!options);
  };
  useEffect(() => {
    const closeOptions = () => setOptions(false);
    if (options) {
      document.addEventListener('click', closeOptions);
    }
    return () => {
      document.removeEventListener('click', closeOptions);
    };
  }, [options]);

  const handleEdit = async () => {
    if (currentTitle === editedTitle) return;

    try {
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        title: editedTitle,
        userId: userId
      });
      
      if (response.status === 200) {
        setCurrentTitle(editedTitle);
        setPopupMessage({ content: "Album edited successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
        setIsEditModalOpen(false);
      } else {
        setPopupMessage({ content: "Album edit failed!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Error editing album:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://jsonplaceholder.typicode.com/albums/${id}`);
      
      if (response.status === 200) {
        setPopupMessage({ content: "Delete album successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
        setIsDeleteModalOpen(false);
      } else {
        setPopupMessage({ content: "Delete album failed!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  const isEdited = currentTitle !== editedTitle

  const editModalContent = (
    <div className="">
      <span>Title</span>
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Title"
      />
      <button
        onClick={handleEdit}
        className={`w-full ${isEdited ? 'button-search' : 'button-false'} justify-center`}
        disabled={!isEdited}
      >
        Save Changes
      </button>
      <button
        onClick={() => setIsEditModalOpen(false)}
        className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );

  const deleteModalContent = (
    <div className="">
      <p className="mb-4">Are you sure you want to delete this album?</p>
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
      <button
        onClick={() => setIsDeleteModalOpen(false)}
        className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );

  const optionsMenu = () => {
    return (
      <div className="bg options-menu p-2 right-5 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-[#b4b4b4] hover:text-[#16a34a]" onClick={() => setIsEditModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 2048 2048"><path fill="currentColor" d="M384 1920h412l-32 128H256V128h128V0h128v128h256V0h128v128h256V0h128v128h256V0h128v128h128v648q-34 5-66 17t-62 31V256H384zM1848 896q42 0 78 15t64 41t42 63t16 79q0 39-15 76t-43 65l-717 717l-377 94l94-377l717-716q29-29 65-43t76-14m51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 692l-34 135l135-34z"/></svg>
          <span className="ml-3">
            Edit album
          </span>
        </button>
        <button className="w-full flex items-center text-left px-4 py-2 text-sm hover:bg-[#b4b4b4] hover:text-[#ff4e4e]" onClick={() => setIsDeleteModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z"/></svg>
          <span className="ml-3">
            Delete album
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
      />
      <div className="album-card h-full flex flex-col">
      <div className="mb-5 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex-grow p-2">
            <p className="mb-2 font-semibold">{currentTitle}</p>
            <p>Author: {userName}</p>
          </div>
        </div>
        <div className="fixed top-5 right-5">
          <button onClick={toggleOptions}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15" className="text-current">
              <path fill="currentColor" fillRule="evenodd" d="M3.625 7.5a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0m5 0a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0M12.5 8.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
          {options && optionsMenu()}
      </div>
        <div className="mt-auto w-full flex justify-end">
          <Link
            to={`/albums/${id}/photos`}
            className="button-search"
          >
            View photos of album
          </Link>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-md  w-full">
            <h2 className="text-2xl text-center font-bold mb-4">Edit album {id}</h2>
            {editModalContent}
          </div>
        </div>
      )}
      
      {isDeleteModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl text-center font-bold mb-4">Delete album</h2>
            {deleteModalContent}
          </div>
        </div>
      )}
    </div>
  );
}
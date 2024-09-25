import { useEffect, useState } from "react";
import "./PostCard.css";
import axios from "axios";
import Popup from "../PopUp/Popup";

interface PostCardProps {
  userId: number;
  id: number;
  title: string;
  body: string;
  onViewComments: (postId: number) => void;
  showComments: boolean;
  name: string;
}

export default function PostCard({
  userId,
  id,
  title: initialTitle,
  body: initialBody,
  onViewComments,
  showComments,
  name,
}: PostCardProps) {
  const [like, setLike] = useState(false);
  const [options, setOptions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initialTitle);
  const [currentBody, setCurrentBody] = useState(initialBody);
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const [editedBody, setEditedBody] = useState(initialBody);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });

  
  const handleLike = () => {
    setLike(!like);
  };
  
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
    if (currentTitle === editedTitle && currentBody === editedBody) return;

    try {
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        title: editedTitle,
        body: editedBody,
        userId: userId
      });
      
      if (response.status === 200) {
        setCurrentTitle(editedTitle);
        setCurrentBody(editedBody);
        setPopupMessage({ content: "Post edited successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
        setIsEditModalOpen(false);
      } else {
        setPopupMessage({ content: "Post edit failed!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      
      if (response.status === 200) {
        setPopupMessage({ content: "Delete post successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
        setIsDeleteModalOpen(false);
      } else {
        setPopupMessage({ content: "Delete post failed!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const isEdited = currentTitle !== editedTitle || currentBody !== editedBody;

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
      <span>Body</span>
      <textarea
        value={editedBody}
        onChange={(e) => setEditedBody(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Body"
        rows={4}
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
      <p className="mb-4">Are you sure you want to delete this post?</p>
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
      <div className="bg-[#242526] options-menu p-2 right-5 mt-2 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="arrow-up"></div>
        <button className="options-item" onClick={() => setIsEditModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 2048 2048"><path fill="currentColor" d="M384 1920h412l-32 128H256V128h128V0h128v128h256V0h128v128h256V0h128v128h256V0h128v128h128v648q-34 5-66 17t-62 31V256H384zM1848 896q42 0 78 15t64 41t42 63t16 79q0 39-15 76t-43 65l-717 717l-377 94l94-377l717-716q29-29 65-43t76-14m51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 692l-34 135l135-34z"/></svg>
          <span className="ml-3">
            Edit post
          </span>
        </button>
        <button className="options-item" onClick={() => setIsDeleteModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z"/></svg>
          <span className="ml-3">
            Delete post
          </span>
        </button>
      </div>
    );
  };

  return (
    <>
      <Popup
        content={popupMessage.content}
        isShow={popupMessage.isShow}
      />
      <div className="w-full flex justify-center">
        <div className="post-card">
          <div className="mb-5 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 26 26" className="text-current">
                <g fill="none">
                  <defs>
                    <mask id="pepiconsPencilPersonCheckmarkCircleFilled0">
                      <path fill="#fff" d="M0 0h26v26H0z"/>
                      <g fill="#000" fillRule="evenodd" clipRule="evenodd">
                        <path d="M9.8 6a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M6.3 8.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0"/>
                        <path d="M3.8 17.5c0-3.322 2.67-6.5 6-6.5s6 3.178 6 6.5v2a.5.5 0 0 1-1 0v-2c0-2.873-2.32-5.5-5-5.5s-5 2.627-5 5.5v2a.5.5 0 0 1-1 0zM21.154 6.563a.5.5 0 0 1 .194.68l-2.778 5a.5.5 0 0 1-.874-.486l2.778-5a.5.5 0 0 1 .68-.194"/>
                        <path d="M14.965 9.465a.5.5 0 0 1 .703-.078l2.778 2.223a.5.5 0 1 1-.625.78l-2.778-2.222a.5.5 0 0 1-.078-.703"/>
                      </g>
                    </mask>
                  </defs>
                  <circle cx="13" cy="13" r="13" fill="currentColor" mask="url(#pepiconsPencilPersonCheckmarkCircleFilled0)"/>
                </g>
              </svg>
              <p className="pl-3">{name}</p>
            </div>
            <div>
              <button onClick={toggleOptions}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15" className="text-current">
                  <path fill="currentColor" fillRule="evenodd" d="M3.625 7.5a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0m5 0a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0M12.5 8.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25" clipRule="evenodd"/>
                </svg>
              </button>
              {options && optionsMenu()}
            </div>
          </div>

          <p>Title: {currentTitle}</p>
          <p className="mx-5 my-2">{currentBody}</p>
          <div className="w-full grid grid-cols-3 mt-5 border-t border-1 border-[#3e4042]">
            <div className="flex justify-center">
              <button
                onClick={handleLike}
                className={`button-post w-full mx-2 flex items-center justify-center ${like ? "text-[#3ecf8e]" : ""}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                  <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                    <path d="M27.6 18.6v-7.2A5.4 5.4 0 0 0 22.2 6L15 22.2V42h20.916a3.6 3.6 0 0 0 3.6-3.06L42 22.74a3.6 3.6 0 0 0-3.6-4.14z" />
                    <path fill="currentColor" d="M15 22h-4.806C8.085 21.963 6.283 23.71 6 25.8v12.6a4.16 4.16 0 0 0 4.194 3.6H15z" />
                  </g>
                </svg>
                {like ? "Liked" : "Like"}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => onViewComments(id)}
                className="w-full button-post mt-3 mx-2 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="mr-2" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1"/></svg>
                {showComments ? "Hide Comments" : "Comments"}
              </button>
            </div>
          <div className="flex justify-center">
            <button className="w-full button-post mt-3 mx-2 flex items-center justify-center">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" fillRule="evenodd" d="M12.207 2.232a.75.75 0 0 0 .025 1.06l4.146 3.958H6.375a5.375 5.375 0 0 0 0 10.75H9.25a.75.75 0 0 0 0-1.5H6.375a3.875 3.875 0 0 1 0-7.75h10.003l-4.146 3.957a.75.75 0 0 0 1.036 1.085l5.5-5.25a.75.75 0 0 0 0-1.085l-5.5-5.25a.75.75 0 0 0-1.06.025Z" clipRule="evenodd"/></svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
    {isEditModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-md  w-full">
            <h2 className="text-2xl text-center font-bold mb-4">Edit Post {id}</h2>
            {editModalContent}
          </div>
        </div>
      )}
      
      {isDeleteModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl text-center font-bold mb-4">Delete Post</h2>
            {deleteModalContent}
          </div>
        </div>
      )}
    </>
  );
}

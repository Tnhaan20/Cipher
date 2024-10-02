import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import FuncButton from "../../components/Button/Button";
import Popup from "../../components/PopUp/Popup";

export default function UserAlbum() {
  interface UserAlbum {
    userId: number;
    id: number;
    title: string;
  }

  const { id } = useParams<{ id: string }>();
  const [albums, setAlbums] = useState<UserAlbum[]>([]);
  const [allAlbums, setAllAlbums] = useState<UserAlbum[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [popupMessage, setPopupMessage] = useState({content: "", isShow: false})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "" });
  const [formErrors, setFormErrors] = useState({ title: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({ title: false });

  useEffect(() => {
    loadUserAlbums();
  }, [id]);
  
  useEffect(() => {
    searchAlbum();
  }, [searchInput]);


  const loadUserAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jsonplaceholder.typicode.com/albums?userId=${id}`);
      if (response.data.length === 0) {
        setPopupMessage({ content: "No album found!", isShow: true });

        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      } else {
        setAllAlbums(response.data)
        setAlbums(response.data);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchAlbum = () => {
    if (!searchInput.trim()) {
      setAlbums(allAlbums);
      return;
    }

    const filteredAlbums = allAlbums.filter(album =>
      album.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (filteredAlbums.length === 0) {
      setPopupMessage({ content: "No album found!", isShow: true });
    } else {
    }

    setAlbums(filteredAlbums);
  };

  const validateForm = () => {
    const errors = {
      title: newAlbum.title.trim() === "" ? "Title is required" : "",
    };
    setFormErrors(errors);
    const isValid = Object.values(errors).every(error => error === "");
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewAlbum(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const handleInputBlur = (e: any) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const createAlbum = async () => {
    if (!validateForm()) return;
    try {
      console.log('Creating album');
      const res = await axios.post(`https://jsonplaceholder.typicode.com/albums`, {
        title: newAlbum.title,
        userId: id
      });
      setAlbums(prevPosts => [res.data, ...(prevPosts || [])]);
      setAllAlbums(prevPosts => [res.data, ...(prevPosts || [])]);
      setNewAlbum({ title: "" });
      setTouched({ title: false});
      console.log("New album created:", { ...res.data });
      setIsModalOpen(false);
      setPopupMessage({ content: "Album created successfully!", isShow: true });
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
      }, 3000);
    } catch (error) {
      console.log(error);
      setPopupMessage({ content: "Error creating album. Please try again.", isShow: true });
      
      // Hide error popup after 3 seconds
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
      }, 3000);
    
    }
  }

  const createAlbumForm = () => {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col p-5">
          <div className="w-full"> 
            <span>Title</span>
            <input 
              className={`p-3 w-full mb-1 ${touched.title && formErrors.title ? 'border-red-500' : ''}`} 
              name="title" 
              value={newAlbum.title} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text" 
              placeholder="Title"
            />
            {touched.title && formErrors.title && <p className="text-red-500 text-sm mb-2">{formErrors.title}</p>}
          </div>
          
          <div className="w-full">
            <span>User ID</span>
            <input
              className="p-3 w-full mb-1"
              type="number"
              name="userId"
              placeholder="User ID"
              value={id}
              readOnly
            />
          </div>
          <div className="w-full flex items-end align-bottom mt-4">
            <button 
              className={`${!isFormValid ? 'button-false w-full justify-center' : 'button-search w-full justify-center'}`} 
              onClick={createAlbum}
              disabled={!isFormValid}
            >
              Submit
            </button>
            
          </div>
        </div>
      </div>
    )
  }
  

  return (
    <div className="w-full">
      <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
      />
      <div className="w-full p-5">
        <div className="grid grid-cols-2">
          <div className="w-full flex justify-start">
            <FuncButton
                name="Create album"
                type="create"
                modalTitle="Create album"
                modalContent={createAlbumForm()}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                style="max-w-2xl"
              />
          </div>

          <div className="w-full flex justify-end">
            <input
                type="text"
                className="search-input p-2 h-11 mt-2 mr-2 w-[60%]"
                placeholder="Search albums by title"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
          </div>

        </div>
      </div>

      {loading ? (
        <p className="text-center my-4">Loading albums...</p>
      ) : albums && albums.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 p-5">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              userId={album.userId}
              id={album.id}
              title={album.title}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
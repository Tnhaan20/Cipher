import axios from "axios";
import { useEffect, useState } from "react";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import FuncButton from "../../components/Button/Button";
import Popup from "../../components/PopUp/Popup";

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface User {
  userId: number;
  name: string;
}

export default function Album() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [popupMessage, setPopupMessage] = useState({content: "", isShow: false})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "", userId: "" });
  const [formErrors, setFormErrors] = useState({ title: "", userId: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({ title: false, userId: false });
  const [users, setUsers] = useState<{ [key: number]: User }>({});


  useEffect(() => {
    loadAlbums();
    loadUserID()
  }, []);

  
  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Album[]>(
        "https://jsonplaceholder.typicode.com/albums"
      );
      setAlbums(response.data);
      setAllAlbums(response.data);
    } catch (error) {
      console.error("Error loading albums:", error);
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

    

    setAlbums(filteredAlbums);
  };

  const loadUserID = async () => {
    try {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/users`);
      const userList = res.data.map((user: any) => ({ userId: user.id, name: user.name }));
      setUsers(userList.reduce((map: any, user: any) => ({ ...map, [user.userId]: user }), {}));
    } catch (error) {
      console.log('Error loading users', error);
    }
  };

  const validateForm = () => {
    const errors = {
      title: newAlbum.title.trim() === "" ? "Title is required" : "",
      userId: newAlbum.userId.trim() === "" ? "User ID is required" : ""
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
      console.log('Creating post');
      const res = await axios.post(`https://jsonplaceholder.typicode.com/albums`, {
        title: newAlbum.title,
        userId: parseInt(newAlbum.userId)
      });
      setAlbums(prevPosts => [res.data, ...(prevPosts || [])]);
      setAllAlbums(prevPosts => [res.data, ...(prevPosts || [])]);
      setNewAlbum({ title: "", userId: "" });
      setTouched({ title: false, userId: false });
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
            <span>User</span>
            <select
              title="UID"
              className={`p-3 w-full mb-1 ${touched.userId && formErrors.userId ? 'border-red-500' : ''}`}
              name="userId"
              value={newAlbum.userId}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            >
              <option value="">Select User</option>
              {Object.values(users).map((user: User) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} - ID: {user.userId}
                </option>
              ))}
            </select>
            {touched.userId && formErrors.userId && (
              <p className="text-red-500 text-sm mb-2">{formErrors.userId}</p>
            )}
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
  
  
  useEffect(() => {
    searchAlbum();
  }, [searchInput]);

  return (
    <div className="w-full">
      <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
      />
      <div className="w-full grid grid-cols-2 p-5">
        <div className="grid-cols-1">
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
        <div className="grid-cols-1">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search albums by title"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3 p-5">
      {loading ? (
          <p className="col-span-full text-center">Loading albums...</p>
        ) : albums.length > 0 ? (
          albums.map((album) => (
            <AlbumCard
              key={album.id}
              userId={album.userId}
              id={album.id}
              title={album.title}
            />
          ))
        ) : (
          <p className="col-span-full text-center">No albums found.</p>
        )}
      </div>
    </div>
  );
}
import axios from "axios";
import { useEffect, useState } from "react";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import FuncButton from "../../components/Button/Button";
import Popup from "../../components/PopUp/Popup";
import bg from "../../assets/album-bg.jpg"

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

  const loadUser = async (userId: number) => {
    if(!users[userId]) {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
        setUsers((prev) => ({...prev, [userId]: {userId: response.data.id, name: response.data.name}}))
      } catch (error) {
        console.log('E' + error);
      }
    }
  }
  
  
  useEffect(() => {
    searchAlbum();
  }, [searchInput]);
  
  if (loading) return <div className="line-wobble mt-10"></div>;

  return (
    <div className="w-full">
      <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
      />
    <div className="fixed top-0 right-40 z-50">
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
        <div className="fixed w-[30%] top-[0.65rem] left-48 z-30">
        <input
          type="text"
          className="w-[70%] p-2 pl-10 rounded-xl"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10.783 18.828a8.05 8.05 0 0 0 7.439-4.955a8.03 8.03 0 0 0-1.737-8.765a8.045 8.045 0 0 0-13.735 5.68c0 2.131.846 4.174 2.352 5.681a8.05 8.05 0 0 0 5.68 2.359m5.706-2.337l4.762 4.759"
          />
        </svg>
    </div>
    <div className="">
          <img 
            className="w-full fade h-[28.5rem] object-cover absolute top-14 left-0" 
            src={bg} 
            alt="Blurred social media banner" 
          />
          <div className="relative top-20 left-14 mt-5 text-center">
            <p className="text-2xl ml-5 text-[#1c1b22de]">The album</p>
          </div>
          <div className="relative left-[26rem] bottom-[27rem]">
            <p className="text-sm text-[#1c1b22de] transform -rotate-90">Every photo tells a story,</p>
            <p className="text-sm text-[#1c1b22de] transform -rotate-90 ml-10">and every album holds a lifetime of memories.</p>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 pb-4 pt-80 px-4">
      {albums.length > 0 ? (
        albums.map((album) => {
            loadUser(album.userId);
            return(
            <AlbumCard
              key={album.id}
              userId={album.userId}
              id={album.id}
              title={album.title}
              userName={users[album.userId]?.name || "Loading..."}
            />
          )})
        ) : (
          <p className="col-span-full text-center">No albums found.</p>
        )}
      </div>
    </div>
  );
}
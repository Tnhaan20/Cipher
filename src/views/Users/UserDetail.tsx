import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom';
import './UserDetail.css'
import Popup from '../../components/PopUp/Popup';

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User>(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      setUser(response.data);
      setEditedUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching User:", error);
      setError("Failed to load User. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUser();
  }, [id]);

  const checkIfFormHasChanges = () => {
    if (!user || !editedUser) return false;
    return JSON.stringify(user) !== JSON.stringify(editedUser);
  };

  // Update handleEdit
  const handleEdit = async () => {
    if (!editedUser || !hasChanges) return;

    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, editedUser);

      if (response.status === 200) {
        setUser(editedUser);
        setPopupMessage({ content: "User edited successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
        setIsEditModalOpen(false);
      } else {
        setPopupMessage({ content: "User edit failed!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };


  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      
      if (response.status === 200) {
        setPopupMessage({ content: "Delete user successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
        setIsDeleteModalOpen(false);
        // Here you might want to redirect the user to a different page
      } else {
        setPopupMessage({ content: "Delete user failed!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User,
    nestedField?: keyof Address | keyof Company
  ) => {
    if (!editedUser) return;
  
    setEditedUser((prev) => {
      if (!prev) return prev;
  
      // Handle nested fields in 'address' or 'company'
      if (field === 'address' && nestedField) {
        return {
          ...prev,
          address: {
            ...prev.address,
            [nestedField]: e.target.value,
          },
        };
      }
  
      if (field === 'company' && nestedField) {
        return {
          ...prev,
          company: {
            ...prev.company,
            [nestedField]: e.target.value,
          },
        };
      }
  
      // Handle other fields
      return {
        ...prev,
        [field]: e.target.value,
      };
    });
    setHasChanges(checkIfFormHasChanges()); // Check if there are changes

  };
  

  const editModalContent = editedUser && (
    <div className="w-full max-w-4xl mx-auto p-6 overflow-y-auto max-h-[80vh]">
      <h2 className="text-2xl font-bold mb-4">General Details</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) => handleInputChange(e, 'name')}
            className="w-full p-2 border rounded-md"
            placeholder="Name"
          />
        </div>
  
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
          <input
            type="text"
            value={editedUser.username}
            onChange={(e) => handleInputChange(e, 'username')}
            className="w-full p-2 border rounded-md"
            placeholder="Username"
          />
        </div>
  
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => handleInputChange(e, 'email')}
            className="w-full p-2 border rounded-md"
            placeholder="Email"
          />
        </div>
  
        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
          <input
            type="text"
            value={editedUser.phone}
            onChange={(e) => handleInputChange(e, 'phone')}
            className="w-full p-2 border rounded-md"
            placeholder="Phone"
          />
        </div>
  
        {/* Website Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website*</label>
          <input
            type="text"
            value={editedUser.website}
            onChange={(e) => handleInputChange(e, 'website')}
            className="w-full p-2 border rounded-md"
            placeholder="Website"
          />
        </div>
      </div>
  
      <h2 className="text-2xl font-bold mb-4">Address</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Street Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street*</label>
          <input
            type="text"
            value={editedUser.address.street}
            onChange={(e) => handleInputChange(e, 'address', 'street')}
            className="w-full p-2 border rounded-md"
            placeholder="Street"
          />
        </div>
  
        {/* Suite Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suite</label>
          <input
            type="text"
            value={editedUser.address.suite}
            onChange={(e) => handleInputChange(e, 'address', 'suite')}
            className="w-full p-2 border rounded-md"
            placeholder="Suite"
          />
        </div>
  
        {/* City Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={editedUser.address.city}
            onChange={(e) => handleInputChange(e, 'address', 'city')}
            className="w-full p-2 border rounded-md"
            placeholder="City"
          />
        </div>
  
        {/* Zipcode Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
          <input
            type="text"
            value={editedUser.address.zipcode}
            onChange={(e) => handleInputChange(e, 'address', 'zipcode')}
            className="w-full p-2 border rounded-md"
            placeholder="Zipcode"
          />
        </div>
      </div>
  
      <h2 className="text-2xl font-bold mb-4">Company</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Company Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={editedUser.company.name}
            onChange={(e) => handleInputChange(e, 'company', 'name')}
            className="w-full p-2 border rounded-md"
            placeholder="Company Name"
          />
        </div>
  
        {/* Company Catch Phrase Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catch Phrase</label>
          <input
            type="text"
            value={editedUser.company.catchPhrase}
            onChange={(e) => handleInputChange(e, 'company', 'catchPhrase')}
            className="w-full p-2 border rounded-md"
            placeholder="Company Catch Phrase"
          />
        </div>
  
        {/* Company BS Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BS</label>
          <input
            type="text"
            value={editedUser.company.bs}
            onChange={(e) => handleInputChange(e, 'company', 'bs')}
            className="w-full p-2 border rounded-md"
            placeholder="Company BS"
          />
        </div>
      </div>
  
      {/* Save button */}
      <button
        onClick={handleEdit}
        className={`w-full justify-center col-span-2 ${hasChanges ? 'button-search' : 'button-false'}`}
        disabled={!hasChanges}
      >
        Save Changes
      </button>
      <button
        onClick={() => setIsEditModalOpen(false)}
        className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 col-span-2"
      >
        Cancel
      </button>
    </div>
  );
  

  const deleteModalContent = (
    <div className="">
      <p className="mb-4">Are you sure you want to delete this user?</p>
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

  return (
    <div className="w-full">

      <Popup
        content={popupMessage.content}
        isShow={popupMessage.isShow}
      />
      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {loading ? (
        <div className="line-wobble mt-10"></div>
      ) : user ? (
        <div className="w-full flex justify-center p-4 pt-10 rounded-lg">
          <div className='px-10'>
            <img
              src='https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'
              alt=''
              className="w-40 object-cover mb-2 rounded"
            />
          </div>
          <div className='px-5 grid grid-cols-4'>
            <div>
              <h2 className="font-bold">Info:</h2>
              <p>ID: {user.id}</p>
              <p>Name: {user.name}</p>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p>Website: {user.website}</p>
            </div>
            <div>
              <h2 className="font-bold">Address:</h2>
              <p>{user.address.street}, {user.address.suite}</p>
              <p>{user.address.city}, {user.address.zipcode}</p>
            </div>
            <div>
              <h2 className="font-bold">Company:</h2>
              <p>{user.company.name}</p>
              <p>{user.company.catchPhrase}</p>
              <p>{user.company.bs}</p>
            </div>
            <div>
              <div>
                <button className="button" onClick={() => setIsEditModalOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20" fill="none" className="svg-icon"><g stroke-width="1.5" stroke-linecap="round" stroke="#fff"><circle r="2.5" cy="10" cx="10"></circle><path fill-rule="evenodd" d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z" clip-rule="evenodd"></path></g></svg>
                  <span className="lable">Edit User</span>
                </button>
              </div>
              <div className="mt-4">
                <button className="button" onClick={() => setIsDeleteModalOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  <span className="lable">Delete User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No user found</p>
      )}
            
      <div className='w-full flex justify-center pt-10'>
        <div className='w-[50%] flex justify-center user-nav pt-5 border-t border-gray-500'>
          <NavLink to={`/users/${id}/detail`} className={({ isActive }) => isActive ? 'active-nav' : ''} end>Posts</NavLink>
          <NavLink to={`/users/${id}/detail/tasks`} className={({ isActive }) => isActive ? 'active-nav' : ''}>To-do Tasks</NavLink>
          <NavLink to={`/users/${id}/detail/albums`} className={({ isActive }) => isActive ? 'active-nav' : ''}>Albums</NavLink>
        </div>
      </div>
      <Outlet />

      {isEditModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-4xl w-full">
          <h2 className="text-2xl text-center font-bold mb-4">Edit User {id}</h2>
            {editModalContent}
          </div>
        </div>
      )}
      
      {isDeleteModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl text-center font-bold mb-4">Delete User {id}</h2>
            {deleteModalContent}
          </div>
        </div>
      )}

         
    </div>
  )
}
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import "./UserDetail.css";
import Popup from "../../components/PopUp/Popup";

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
  const [popupMessage, setPopupMessage] = useState({
    content: "",
    isShow: false,
  });
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
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        editedUser
      );

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
      console.error("Error editing user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );

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
      console.error("Error deleting user:", error);
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
      if (field === "address" && nestedField) {
        return {
          ...prev,
          address: {
            ...prev.address,
            [nestedField]: e.target.value,
          },
        };
      }

      if (field === "company" && nestedField) {
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name*
          </label>
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) => handleInputChange(e, "name")}
            className="w-full p-2 border rounded-md"
            placeholder="Name"
          />
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username*
          </label>
          <input
            type="text"
            value={editedUser.username}
            onChange={(e) => handleInputChange(e, "username")}
            className="w-full p-2 border rounded-md"
            placeholder="Username"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => handleInputChange(e, "email")}
            className="w-full p-2 border rounded-md"
            placeholder="Email"
          />
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone*
          </label>
          <input
            type="text"
            value={editedUser.phone}
            onChange={(e) => handleInputChange(e, "phone")}
            className="w-full p-2 border rounded-md"
            placeholder="Phone"
          />
        </div>

        {/* Website Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website*
          </label>
          <input
            type="text"
            value={editedUser.website}
            onChange={(e) => handleInputChange(e, "website")}
            className="w-full p-2 border rounded-md"
            placeholder="Website"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Address</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Street Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street*
          </label>
          <input
            type="text"
            value={editedUser.address.street}
            onChange={(e) => handleInputChange(e, "address", "street")}
            className="w-full p-2 border rounded-md"
            placeholder="Street"
          />
        </div>

        {/* Suite Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suite
          </label>
          <input
            type="text"
            value={editedUser.address.suite}
            onChange={(e) => handleInputChange(e, "address", "suite")}
            className="w-full p-2 border rounded-md"
            placeholder="Suite"
          />
        </div>

        {/* City Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={editedUser.address.city}
            onChange={(e) => handleInputChange(e, "address", "city")}
            className="w-full p-2 border rounded-md"
            placeholder="City"
          />
        </div>

        {/* Zipcode Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zipcode
          </label>
          <input
            type="text"
            value={editedUser.address.zipcode}
            onChange={(e) => handleInputChange(e, "address", "zipcode")}
            className="w-full p-2 border rounded-md"
            placeholder="Zipcode"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Company</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Company Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={editedUser.company.name}
            onChange={(e) => handleInputChange(e, "company", "name")}
            className="w-full p-2 border rounded-md"
            placeholder="Company Name"
          />
        </div>

        {/* Company Catch Phrase Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catch Phrase
          </label>
          <input
            type="text"
            value={editedUser.company.catchPhrase}
            onChange={(e) => handleInputChange(e, "company", "catchPhrase")}
            className="w-full p-2 border rounded-md"
            placeholder="Company Catch Phrase"
          />
        </div>

        {/* Company BS Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            BS
          </label>
          <input
            type="text"
            value={editedUser.company.bs}
            onChange={(e) => handleInputChange(e, "company", "bs")}
            className="w-full p-2 border rounded-md"
            placeholder="Company BS"
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleEdit}
        className={`w-full justify-center col-span-2 ${
          hasChanges ? "button-search" : "button-false"
        }`}
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

  if (loading) return <div className="line-wobble mt-10"></div>;

  return (
    <div className="w-full">
      <Popup content={popupMessage.content} isShow={popupMessage.isShow} />
      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {user ? (
        <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-start mb-8">
          {/* Profile Picture */}
          <div className="mr-8">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
              alt="User Profile Picture"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
  
          {/* User Info Section */}
          <div className="flex-grow">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold mt-2 mr-4">{user.name} ({user.username})</h2>
              <button
                className="button-search mr-3 mb-1"
                onClick={() => setIsEditModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="inline-block mr-1"
                >
                  <g stroke-width="1.5" stroke-linecap="round" stroke="#fff">
                    <circle r="2.5" cy="10" cx="10"></circle>
                    <path
                      fill-rule="evenodd"
                      d="M8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001c.3392.95358 1.4284 1.40477 2.3425.97027c1.4514-.68995 2.9657.82427 2.2758 2.27575c-.4345.91407.0166 2.00334.9702 2.34248c1.5143.53842 1.5143 2.67996 0 3.21836c-.9536.3391-1.4047 1.4284-.9702 2.3425c.6899 1.4514-.8244 2.9656-2.2758 2.2757c-.9141-.4345-2.0033.0167-2.3425.9703c-.5384 1.5142-2.67989 1.5142-3.21831 0c-.33914-.9536-1.4284-1.4048-2.34247-.9703c-1.45148.6899-2.96571-.8243-2.27575-2.2757c.43449-.9141-.01669-2.0034-.97028-2.3425c-1.51422-.5384-1.51422-2.67994.00001-3.21836c.95358-.33914 1.40476-1.42841.97027-2.34248c-.68996-1.45148.82427-2.9657 2.27575-2.27575c.91407.4345 2.00333-.01669 2.34247-.97026z"
                      clip-rule="evenodd"
                    ></path>
                  </g>
                </svg>
                Edit Profile
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
            <div className="flex space-x-8 mb-4">
              <span><strong>10</strong> posts</span>
              <span><strong>256</strong> followers</span>
              <span><strong>284</strong> following</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.phone}</p>
              <p className="text-blue-500">{user.website}</p>
              <p className="mt-2 text-gray-600">
                {user.address.street}, {user.address.suite}
              </p>
              <p className="text-gray-600">
                {user.address.city}, {user.address.zipcode}
              </p>
            </div>
          </div>
        </div>

          {/* <!-- Edit and Delete Buttons --> */}
        </div>
      ) : (
        <p>No user found</p>
      )}

      <div className="w-full flex justify-center">
        <div className="w-[60%] flex justify-center items-center user-nav pt-1 border-t border-gray-500">
          <NavLink
            to={`/users/${id}/detail`}
            className={({ isActive }) =>
              `flex items-center ${isActive ? "active-nav" : ""}`
            }
            end
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 1H1v18h18V1zm14 2v14H3V3zm4 18H5v2h18V5h-2zM15 5H5v2h10zM5 9h10v2H5zm7 4H5v2h7z"
              ></path>
            </svg>
            <span className="ml-3">Posts</span>
          </NavLink>
          <NavLink
            to={`/users/${id}/detail/tasks`}
            className={({ isActive }) =>
              `flex items-center ${isActive ? "active-nav" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path d="M10 4a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2h-4zM7.17 4A3.001 3.001 0 0 1 10 2h4c1.306 0 2.418.835 2.83 2H18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1.17zm0 2H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1.17A3.001 3.001 0 0 1 14 8h-4a3.001 3.001 0 0 1-2.83-2zM7 11a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1z"></path>
              </g>
            </svg>
            <span className="ml-3">Tasks</span>
          </NavLink>
          <NavLink
            to={`/users/${id}/detail/albums`}
            className={({ isActive }) =>
              `flex items-center ${isActive ? "active-nav" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              >
                <path d="M16.24 3.5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h8.5a5 5 0 0 0 5-5v-7a5 5 0 0 0-5-5" />
                <path d="m2.99 17l2.75-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.49 1.93M7.99 10.17a1.66 1.66 0 1 0 0-3.35a1.66 1.66 0 0 0 0 3.35" />
              </g>
            </svg>
            <span className="ml-3">Albums</span>
          </NavLink>
        </div>
      </div>
      <Outlet />

      {isEditModalOpen && (
        <div className="fixed  bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-4xl w-full">
            <h2 className="text-2xl text-center font-bold mb-4">
              Edit User {id}
            </h2>
            {editModalContent}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed bg inset-0 flex items-center justify-center z-50">
          <div className="modal rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl text-center font-bold mb-4">
              Delete User {id}
            </h2>
            {deleteModalContent}
          </div>
        </div>
      )}
    </div>
  );
}

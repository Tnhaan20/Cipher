import axios from 'axios';
import { useEffect, useState } from 'react'
import UserCard from '../../components/UserCard/UserCard';
import Button from '../../components/Button/Button';
import Popup from '../../components/PopUp/Popup';

export default function User() {
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
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: { lat: "", lng: "" }
    },
    phone: "",
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: ""
    }
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof User, boolean>>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });
  
  const loadUsers = async() => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`https://jsonplaceholder.typicode.com/users`);
      setUsers(response.data);
      setAllUsers(response.data);
      setError(null);
    } catch (error) {
      console.log('Error: ' + error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const searchUser = () => {
    if (!searchInput.trim()) {
      setUsers(allUsers);
      setError(null);
      return;
    }

    const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (filteredUsers.length === 0) {
      setError("No users found matching the search criteria.");
    } else {
      setError(null);
    }

    setUsers(filteredUsers);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {
      name: newUser.name.trim() === "" ? "Name is required" : "",
      username: newUser.username.trim() === "" ? "Username is required" : "",
      email: newUser.email.trim() === "" ? "Email is required" : 
             !/\S+@\S+\.\S+/.test(newUser.email) ? "Email is invalid" : "",
      phone: newUser.phone.trim() === "" ? "Phone is required" : "",
      website: newUser.website.trim() === "" ? "Website is required" : ""
    };
    setFormErrors(errors);
    const isValid = Object.values(errors).every(error => error === "");
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const handleInputBlur = (e: any) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  
  const createUser = async () => {
    if (!validateForm()) return;
    try {
      console.log('Creating user');
      const res = await axios.post(`https://jsonplaceholder.typicode.com/users`, newUser);
      setUsers(prevUsers => [res.data, ...prevUsers]);
      setAllUsers(prevUsers => [res.data, ...prevUsers]);
      setNewUser({
        name: "",
        username: "",
        email: "",
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: { lat: "", lng: "" }
        },
        phone: "",
        website: "",
        company: {
          name: "",
          catchPhrase: "",
          bs: ""
        }
      });
      setTouched({});
      console.log("New user created:", res.data);
      setIsModalOpen(false);
      setPopupMessage({ content: "New user added to the system", isShow: true});
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
      }, 3000);

    } catch (error) {
      console.log(error);
      setPopupMessage({ content: "Error creating user. Please try again.", isShow: true});
      setTimeout(() => {
        setPopupMessage(prev => ({ ...prev, isShow: false }));
      }, 3000);
    }
  }

  const createUserForm = () => {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">General Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input 
              className={`w-full p-2 border rounded-md ${touched.name && formErrors.name ? 'border-red-500' : ''}`}
              name="name" 
              value={newUser.name} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text" 
              placeholder="Name"
            />
            {touched.name && formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
            <input 
              className={`w-full p-2 border rounded-md ${touched.username && formErrors.username ? 'border-red-500' : ''}`}
              name="username" 
              value={newUser.username} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text" 
              placeholder="Username"
            />
            {touched.username && formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input 
              className={`w-full p-2 border rounded-md ${touched.email && formErrors.email ? 'border-red-500' : ''}`}
              name="email" 
              value={newUser.email} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="email" 
              placeholder="Email"
            />
            {touched.email && formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
            <input 
              className={`w-full p-2 border rounded-md ${touched.phone && formErrors.phone ? 'border-red-500' : ''}`}
              name="phone"
              value={newUser.phone} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="tel" 
              placeholder="Phone"
            />
            {touched.phone && formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website*</label>
            <input 
              className={`w-full p-2 border rounded-md ${touched.website && formErrors.website ? 'border-red-500' : ''}`}
              name="website" 
              value={newUser.website} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text" 
              placeholder="Website"
            />
            {touched.website && formErrors.website && <p className="text-red-500 text-sm mt-1">{formErrors.website}</p>}
          </div>
        </div>
  
        <h2 className="text-2xl font-bold mb-4">Address</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street*</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="street" 
              value={newUser.address.street} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text" 
              placeholder="Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suite</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="suite" 
              value={newUser.address.suite} 
              type="text" 
              placeholder="Suite"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="city" 
              value={newUser.address.city} 
              type="text" 
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="zipcode" 
              value={newUser.address.zipcode} 
              type="text" 
              placeholder="Zipcode"
            />
          </div>
        </div>
  
        <h2 className="text-2xl font-bold mb-4">Geo Location</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="lat" 
              value={newUser.address.geo.lat} 
              type="text" 
              placeholder="Latitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="lng" 
              value={newUser.address.geo.lng} 
              type="text" 
              placeholder="Longitude"
            />
          </div>
        </div>
  
        <h2 className="text-2xl font-bold mb-4">Company</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="name" 
              value={newUser.company.name} 
              type="text" 
              placeholder="Company Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catch Phrase</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="catchPhrase" 
              value={newUser.company.catchPhrase} 
              type="text" 
              placeholder="Company Catch Phrase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BS</label>
            <input 
              className="w-full p-2 border rounded-md"
              name="bs" 
              value={newUser.company.bs} 
              type="text" 
              placeholder="Company BS"
            />
          </div>
        </div>
  
        <div className="flex justify-end space-x-4">
          
          <button 
            className={`${!isFormValid ? 'button-false w-full justify-center' : 'button-search w-full justify-center'}`} 
            onClick={createUser}
            disabled={!isFormValid}
          >
            Create User
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    searchUser();
  }, [searchInput]);

  return (
    <div className="w-full">
    <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
    />
      <div className="grid grid-cols-2">
        <div className="mr-72">
        <Button
            name="Create user"
            type="create"
            modalTitle="Add new user"
            modalContent={createUserForm()}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            style="max-w-4xl"
          />
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-80"
            placeholder="Search Users by name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      <div className="grid grid-cols-2 mx-5 pr-5 gap-1">
        {loading ? (
          <p className="col-span-full text-center">Loading users...</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="p-1">
              <UserCard
                id={user.id}
                name={user.name}
                phone={user.phone}
                email={user.email}
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center">No users found.</p>
        )}
      </div>

    </div>
  )
}
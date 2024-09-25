import axios from 'axios';
import { useEffect, useState } from 'react'
import UserCard from '../../components/UserCard/UserCard';
import FuncButton from '../../components/Button/Button';

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
  
  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    searchUser();
  }, [searchInput]);

  return (
    <div className="w-full pt-28">
      <div className="grid grid-cols-2">
        <div className="mr-72">
          
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
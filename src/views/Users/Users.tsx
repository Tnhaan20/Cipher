import axios from 'axios';
import React, { Component, useEffect, useState } from 'react'
import UserCard from '../../components/UserCard/UserCard';

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

  const [users, setUsers] = useState<User[] | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async() => {
    try {
      await axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then((response) => {
        setUsers(response.data)        
      })
    } catch (error) {
      console.log('Error: ' + error);
    }
  }

  const searchUser = async() => {
    if (!searchInput.trim()) {
      loadUser();
      return;
    }

    try {
      setLoading(true);
      const id = parseInt(searchInput);
      if (isNaN(id)) {
        setError("Please enter a valid User ID (number).");
        return;
      }
      const response = await axios.get<User>(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      setUsers([response.data]);
      setError(null);
    } catch (error) {
      console.error("Error fetching User:", error);
      setError("User not found. Please try a different ID.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() =>{
    loadUser()
  },[])

    return (
      <div className="w-full pt-28">
        <div className="grid grid-cols-2">
          <div>
            <h1 className="text-3xl pt-3 text-[#2c9063] font-bold">USERS</h1>
          </div>
        <div className="flex justify-end">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-80"
            placeholder="Search Users by id"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={searchUser}
            className="button-search"
          >
            Search
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

        <div className="grid grid-cols-2 mx-5 pr-5 gap-1">
          {users ? 
            users.map((user)=>(
              <div key={user.id} className="p-1">
                <UserCard
                  id={user.id}
                  name={user.name}
                  phone={user.phone}
                  email={user.email}
                />
            </div>
            ))
          :
          (loading ? (
            <p className="col-span-full text-center">Loading user...</p>
          ) : (
            <p className="col-span-full text-center">No user found.</p>
          ))
          }
        
      </div>
      </div>
    )
}

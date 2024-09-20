import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import './UserDetail.css'
import UserPost from './UserPost';

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

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User>(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      setUser(response.data);
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

  return (
    <div className="w-full text-white pt-20 px-4 min-h-screen">
      
      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {loading ? (
        <p className="text-center">Loading user...</p>
      ) : user ? (
        <div className="w-full flex justify-center p-4 pt-10 rounded-lg">
            <div className='px-10'>
                <img
                    src='https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'
                    alt=''
                    className="w-40 object-cover mb-2 rounded"
                />
            </div>
            <div className='px-5 grid grid-cols-3'>
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
    </div>
  )
}
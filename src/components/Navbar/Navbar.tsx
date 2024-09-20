import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div>
            <header className='header'>
                <NavLink to="/" className='font-bold text-[#2c9063] text-3xl'>Training</NavLink>

                <nav className='navbar'>
                    <NavLink
                        className={({ isActive }) => isActive ? 'active-nav' : ''}
                        to="/"
                    >
                        Posts
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => isActive ? 'active-nav' : ''}
                        to="/albums"
                    >
                        Albums
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => isActive ? 'active-nav' : ''}
                        to="/users"
                    >
                        Users
                    </NavLink>
                </nav>
            </header>
        </div>
    );
}

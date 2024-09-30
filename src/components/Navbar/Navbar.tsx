import './Navbar.css';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <NavLink to="/" className="font-bold text-[#2c9063] text-3xl">Training</NavLink>
            </div>
            <nav className="sidebar-nav">
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
        </div>
    );
}
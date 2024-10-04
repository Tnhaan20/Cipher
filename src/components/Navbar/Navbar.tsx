import './Navbar.css';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <div>
            <header className='header w-full px-10'>
                <div className='w-full grid grid-cols-3'>
                    <div className="flex items-center justify-between col-span-1 mr-35">
                        <NavLink to="/" className='font-bold text-[#AD8E70] text-3xl'>Training</NavLink>
                    </div>
                    <div className="w-full flex items-center justify-center col-span-1">
                        <nav className='navbar'>
                            <NavLink
                                className={({ isActive }) => isActive ? 'active-nav' : ''}
                                to="/"
                                title="Posts"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.633 7.11l-6.474-4.02a2.23 2.23 0 0 0-2.362 0L4.354 7.133A2.23 2.23 0 0 0 3.31 9.362l1.67 10.027a2.23 2.23 0 0 0 2.228 1.86h9.582a2.23 2.23 0 0 0 2.229-1.86l1.67-10.027a2.23 2.23 0 0 0-1.058-2.251M8.636 16.459h6.685"/></svg>
                            </NavLink>
                            <NavLink
                                className={({ isActive }) => isActive ? 'active-nav' : ''}
                                to="/albums"
                                title="Albums"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16.24 3.5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h8.5a5 5 0 0 0 5-5v-7a5 5 0 0 0-5-5"/><path d="m2.99 17l2.75-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.49 1.93M7.99 10.17a1.66 1.66 0 1 0 0-3.35a1.66 1.66 0 0 0 0 3.35"/></g></svg>
                            </NavLink>
                            <NavLink
                                className={({ isActive }) => isActive ? 'active-nav' : ''}
                                to="/users"
                                title="Users"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.022 20.354c.284-1.394.974-2.138 2.076-3.038a6.17 6.17 0 0 1 7.805 0c1.101.9 1.882 1.644 2.165 3.038M12 13.028a3.31 3.31 0 1 0 0-6.619a3.31 3.31 0 0 0 0 6.619"/><rect width="18.5" height="18.5" x="2.75" y="2.75" rx="6"/></g></svg>
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    );
}
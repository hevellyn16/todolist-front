import {  useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = () => {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="text-lg font-bold">Todo App</div>
            <div className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/users" className="hover:text-gray-300">Register</Link>
            </div>
            <div className="md:hidden">
                <button onClick={() => setOpenMenu(!openMenu)} className="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </button>
                {openMenu && (
                    <div className="absolute top-16 right-0 w-full bg-gray-800 text-white flex flex-col items-center space-y-4 py-4">
                        <Link to="/dashboard" className="hover:text-gray-300" onClick={() => setOpenMenu(false)}>Dashboard</Link>
                        <Link to="/login" className="hover:text-gray-300" onClick={() => setOpenMenu(false)}>Login</Link>
                        <Link to="/users" className="hover:text-gray-300" onClick={() => setOpenMenu(false)}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
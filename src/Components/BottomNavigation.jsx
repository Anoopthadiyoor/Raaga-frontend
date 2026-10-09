import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FaRegCompass } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";

function BottomNavigation() {
    return (
        <div
            className="fixed-bottom bg-black"
            style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 -4px 18px rgba(220, 53, 69, 0.06)'
            }}
        >
            <div className="d-flex justify-content-around py-2">

                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `text-decoration-none ${isActive ? 'text-danger' : 'text-white'}`
                    }
                >
                    <FaHome size={20} />
                </NavLink>

                <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                        `text-decoration-none ${isActive ? 'text-danger' : 'text-white'}`
                    }
                >
                    <FaRegCompass size={20} />
                </NavLink>

                <NavLink
                    to="/library"
                    className={({ isActive }) =>
                        `text-decoration-none ${isActive ? 'text-danger' : 'text-white'}`
                    }
                >
                    <MdLibraryMusic size={20} />
                </NavLink>

            </div>
        </div>
    );
}

export default BottomNavigation;
import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="shadow-md z-10 flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-bold">
        {user?.company || "Project name"}
      </h1>
      {user && (
        <button
          onClick={logout}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;

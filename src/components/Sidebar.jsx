import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaComment, FaFolderOpen, FaHistory, FaBars } from "react-icons/fa";

const navItems = [
  { icon: <FaUser />, label: "Character Creator", path: "character-creator" },
  { icon: <FaComment />, label: "Conversational Context", path: "conversational-context" },
  { icon: <FaFolderOpen />, label: "Custom Tabs", path: "custom-tabs" },
  { icon: <FaHistory />, label: "Interaction History", path: "interaction-history" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-gray-800 flex flex-col justify-between text-white ${expanded ? "w-48" : "w-18"} transition-all h-full`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="p-4 text-xl w-full self-start hover:bg-gray-700 sticky top-0 flex justify-center"
      >
        <FaBars />
      </button>
      <ul className="flex flex-col items-center justify-center flex-grow w-full">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={`/dashboard/${item.path}`}
            className={({ isActive }) =>
              `flex items-center w-full p-5 hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {expanded && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </ul>
    </div>
  );
}

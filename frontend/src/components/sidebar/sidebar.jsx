import { useState } from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import GroupsList from "../groups/GroupsList";
import { FaPlus } from "react-icons/fa";
import CreateGroupModal from "../groups/CreateGroupModal";
import useTheme from '../../zustand/useTheme';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const themes = ["light", "dark", "cupcake", "emerald", "synthwave"];
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full flex flex-col border-r border-slate-500 p-4">
      <SearchInput />
      <div className="divider px-3"></div>

      {/* Theme Switcher: moved here */}
      <div className="mb-4">
        <label className="label-text text-sm">Theme</label>
        <select
          className="select select-bordered select-sm w-full"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "chats" ? "bg-sky-500 text-white" : "text-gray-300"
          } rounded-l-lg`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "groups" ? "bg-sky-500 text-white" : "text-gray-300"
          } rounded-r-lg`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {activeTab === "groups" && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg mb-3"
        >
          <FaPlus /> Create Group
        </button>
      )}

      {activeTab === "chats" ? <Conversations /> : <GroupsList />}

      <LogoutButton />

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;

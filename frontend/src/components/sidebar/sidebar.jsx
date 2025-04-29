// frontend/src/components/sidebar/sidebar.jsx
import { useState } from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import GroupsList from "../groups/GroupsList";
import { FaPlus } from "react-icons/fa";
import CreateGroupModal from "../groups/CreateGroupModal";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SearchInput />
      <div className="divider px-3"></div>
      
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
      
      {/* Create Group Button (only shown in groups tab) */}
      {activeTab === "groups" && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg mb-3"
        >
          <FaPlus /> Create Group
        </button>
      )}
      
      {/* Content based on active tab */}
      {activeTab === "chats" ? <Conversations /> : <GroupsList />}
      
      <LogoutButton />
      
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
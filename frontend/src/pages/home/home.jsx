// frontend/src/pages/home/home.jsx
import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import GroupMessageContainer from "../../components/groups/GroupMessageContainer";
import Sidebar from "../../components/sidebar/sidebar";
import useConversation from "../../zustand/useConversation";
import useGroupConversation from "../../zustand/useGroupConversation";

const Home = () => {
  const { selectedConversation } = useConversation();
  const { selectedGroup } = useGroupConversation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex h-[500px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebar />
        
        {/* Conditionally render either direct messages or group messages */}
        {selectedGroup ? (
          <GroupMessageContainer />
        ) : (
          <MessageContainer />
        )}
      </div>
    </div>
  );
};

export default Home;
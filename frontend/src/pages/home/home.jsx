import { useEffect } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import GroupMessageContainer from "../../components/groups/GroupMessageContainer";
import Sidebar from "../../components/sidebar/sidebar";
import useConversation from "../../zustand/useConversation";
import useGroupConversation from "../../zustand/useGroupConversation";

const Home = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { selectedGroup, setSelectedGroup } = useGroupConversation();

  // Clear direct chat when group is selected
  useEffect(() => {
    if (selectedGroup) setSelectedConversation(null);
  }, [selectedGroup]);

  // Clear group chat when direct chat is selected
  useEffect(() => {
    if (selectedConversation) setSelectedGroup(null);
  }, [selectedConversation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex h-[500px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <Sidebar />
        {selectedGroup ? <GroupMessageContainer /> : <MessageContainer />}
      </div>
    </div>
  );
};

export default Home;

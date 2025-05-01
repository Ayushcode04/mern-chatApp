import { useState } from 'react';
import useGroupConversation from '../zustand/useGroupConversation';
import { useSocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';

const useSendGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup, addMessage } = useGroupConversation();
  const { socket } = useSocketContext();

  const sendGroupMessage = async (messageText) => {
    if (!selectedGroup?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/group-messages/send/${selectedGroup._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Emit to room
      socket.emit('newGroupMessage', {
        message: data,
        groupId: selectedGroup._id,
      });

      // Append locally using addMessage helper
      addMessage(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendGroupMessage };
};

export default useSendGroupMessage;
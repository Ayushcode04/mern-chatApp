import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useGroupConversation from '../zustand/useGroupConversation';

const useListenGroupMessages = (groupId) => {
  const { socket } = useSocketContext();
  const addMessage = useGroupConversation((state) => state.addMessage);

  useEffect(() => {
    if (!groupId) return;

    // join this group's room
    socket.emit('joinGroup', { groupId });

    // handle incoming group messages
    const handler = ({ message, groupId: incomingGroupId }) => {
      if (incomingGroupId === groupId) addMessage(message);
    };
    socket.on('newGroupMessage', handler);

    return () => {
      socket.off('newGroupMessage', handler);
      socket.emit('leaveGroup', { groupId });
    };
  }, [groupId, socket, addMessage]);
};

export default useListenGroupMessages;
import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useGroupConversation from '../zustand/useGroupConversation';
import notificationSound from '../assets/sounds/notification.mp3';

const useListenGroupMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedGroup } = useGroupConversation();

  useEffect(() => {
    if (selectedGroup) {
      socket?.emit('joinGroup', selectedGroup._id);
    }

    socket?.on('newGroupMessage', (data) => {
      if (data.groupId === selectedGroup?._id) {
        const newMessage = { ...data.message, shouldShake: true };
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, newMessage]);
      }
    });

    return () => {
      if (selectedGroup) {
        socket?.emit('leaveGroup', selectedGroup._id);
      }
      socket?.off('newGroupMessage');
    };
  }, [socket, setMessages, messages, selectedGroup]);
};

export default useListenGroupMessages;
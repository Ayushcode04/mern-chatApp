import { useEffect, useState } from 'react';
import useGroupConversation from '../zustand/useGroupConversation';
import toast from 'react-hot-toast';

const useGetGroupMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedGroup } = useGroupConversation();

  useEffect(() => {
    const getGroupMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/group-messages/${selectedGroup._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedGroup?._id) getGroupMessages();
  }, [selectedGroup?._id, setMessages]);

  return { messages, loading };
};

export default useGetGroupMessages;
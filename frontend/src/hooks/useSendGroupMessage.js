import { useState } from 'react';
import useGroupConversation from '../zustand/useGroupConversation';
import toast from 'react-hot-toast';

const useSendGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedGroup } = useGroupConversation();

  const sendGroupMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/group-messages/send/${selectedGroup._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendGroupMessage, loading };
};

export default useSendGroupMessage;
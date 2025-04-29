import { useState } from 'react';
import toast from 'react-hot-toast';

const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);

  const createGroup = async (groupData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success('Group created successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createGroup, loading };
};

export default useCreateGroup;
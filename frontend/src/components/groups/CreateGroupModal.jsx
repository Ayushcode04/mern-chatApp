import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import useGetConversation from '../../hooks/useGetConversation';
import useCreateGroup from '../../hooks/useCreateGroup';

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: []
  });
  const { conversations } = useGetConversation();
  const { createGroup, loading } = useCreateGroup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupData.name.trim() === '') return;
    if (groupData.members.length === 0) return;
    
    await createGroup(groupData);
    onClose();
    setGroupData({ name: '', description: '', members: [] });
  };

  const toggleMember = (userId) => {
    setGroupData(prev => {
      if (prev.members.includes(userId)) {
        return { ...prev, members: prev.members.filter(id => id !== userId) };
      } else {
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create New Group</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Enter group name"
              value={groupData.name}
              onChange={(e) => setGroupData({...groupData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Group description"
              value={groupData.description}
              onChange={(e) => setGroupData({...groupData, description: e.target.value})}
              rows="2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Members
            </label>
            <div className="max-h-40 overflow-y-auto p-2 bg-gray-700 border border-gray-600 rounded">
              {conversations.map(user => (
                <div 
                  key={user._id} 
                  className="flex items-center py-1"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={groupData.members.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                  />
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <img src={user.profilePic} alt={user.fullName} />
                    </div>
                    <span className="text-white">{user.fullName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
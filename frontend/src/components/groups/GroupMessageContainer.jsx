import GroupMessages from './GroupMessages';
import GroupMessageInput from './GroupMessageInput';
import { TiMessages } from 'react-icons/ti';
import useGroupConversation from '../../zustand/useGroupConversation';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';

const GroupMessageContainer = () => {
  const { selectedGroup, setSelectedGroup } = useGroupConversation();

  useEffect(() => {
    // cleanup function (unmounts)
    return () => {
      setSelectedGroup(null);
    };
  }, [setSelectedGroup]);

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {!selectedGroup ? (
        <NoGroupSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">Group:</span>{' '}
            <span className="text-gray-900 font-bold">{selectedGroup.name}</span>
            <p className="text-xs text-gray-200">{selectedGroup.description}</p>
          </div>
          <GroupMessages />
          <GroupMessageInput />
        </>
      )}
    </div>
  );
};

export default GroupMessageContainer;

const NoGroupSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Select a group to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
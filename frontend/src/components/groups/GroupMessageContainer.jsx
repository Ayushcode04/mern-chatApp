import React from 'react';
import { TiMessages } from 'react-icons/ti';
import useGroupConversation from '../../zustand/useGroupConversation';
import useGetGroupMessages from '../../hooks/useGetGroupMessages';
import useListenGroupMessages from '../../hooks/useListenGroupMessages';
import GroupMessages from './GroupMessages';
import GroupMessageInput from './GroupMessageInput';

const GroupMessageContainer = () => {
  const { selectedGroup } = useGroupConversation();

  // derive groupId; if no group selected, hooks will early-return
  const groupId = selectedGroup?._id;

  // fetch history for this group
  const { messages, loading } = useGetGroupMessages(groupId);
  // subscribe to live updates for this group
  useListenGroupMessages(groupId);

  return (
    <div className="md:min-w-[450px] flex flex-col h-full">
      {!selectedGroup ? (
        <NoGroupSelected />
      ) : (
        <>
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">Group:</span>{' '}
            <span className="text-gray-900 font-bold">
              {selectedGroup.name}
            </span>
            <p className="text-xs text-gray-200">
              {selectedGroup.description}
            </p>
          </div>
          <GroupMessages messages={messages} loading={loading} />
          <GroupMessageInput />
        </>
      )}
    </div>
  );
};

export default GroupMessageContainer;

const NoGroupSelected = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
      <p>Select a group to start messaging</p>
      <TiMessages className="text-3xl md:text-6xl text-center" />
    </div>
  </div>
);
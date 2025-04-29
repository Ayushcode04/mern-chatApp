import { useEffect, useRef } from 'react';
import GroupMessage from './GroupMessage';
import useGetGroupMessages from '../../hooks/useGetGroupMessages';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import useListenGroupMessages from '../../hooks/useListenGroupMessages';

const GroupMessages = () => {
  const { messages, loading } = useGetGroupMessages();
  useListenGroupMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages.length]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <GroupMessage message={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the group conversation</p>
      )}
    </div>
  );
};

export default GroupMessages;
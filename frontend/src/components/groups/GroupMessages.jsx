import { useEffect, useRef } from 'react';
import GroupMessage from './GroupMessage';
import MessageSkeleton from '../skeletons/MessageSkeleton';

// Ensure messages always defaults to an array
const GroupMessages = ({ messages = [], loading = false }) => {
  const lastMessageRef = useRef();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length]);

  // Guard: if messages isn't an array, treat as empty
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="px-4 flex-1 overflow-auto">
      {loading ? (
        // show skeletons when loading
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
      ) : safeMessages.length > 0 ? (
        safeMessages.map((message, idx) => (
          <div key={message._id || idx} ref={idx === safeMessages.length - 1 ? lastMessageRef : null}>
            <GroupMessage message={message} />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">
          Send a message to start the group conversation
        </p>
      )}
    </div>
  );
};

export default GroupMessages;
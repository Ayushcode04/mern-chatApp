import { useAuthContext } from '../../context/AuthContext';
import useGroupConversation from '../../zustand/useGroupConversation';
import { extractTime } from '../../utils/extractTime';

const GroupMessage = ({ message }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId._id === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const profilePic = fromMe ? authUser.profilePic : message.senderId.profilePic;
  const bubbleBgColor = fromMe ? 'bg-blue-500' : '';
  const shakeClass = message.shouldShake ? 'shake' : '';

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User avatar" src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
        {!fromMe && (
          <p className="text-xs font-bold mb-1">{message.senderId.fullName}</p>
        )}
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default GroupMessage;
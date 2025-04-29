import { useSocketContext } from '../../context/SocketContext';
import useGroupConversation from '../../zustand/useGroupConversation';

const GroupItem = ({ group, lastIdx }) => {
  const { selectedGroup, setSelectedGroup } = useGroupConversation();
  const isSelected = selectedGroup?._id === group._id;

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
          isSelected ? 'bg-sky-500' : ''
        }`}
        onClick={() => setSelectedGroup(group)}
      >
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={group.groupIcon} alt="group icon" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{group.name}</p>
            <span className="text-xs text-gray-300">{group.members.length} members</span>
          </div>
          <p className="text-sm text-gray-300 truncate">{group.description}</p>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default GroupItem;
import { useEffect } from 'react';
import GroupItem from './GroupItem';
import useGetGroups from '../../hooks/useGetGroups';

const GroupsList = () => {
  const { loading, groups } = useGetGroups();

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {groups.map((group, idx) => (
        <GroupItem
          key={group._id}
          group={group}
          lastIdx={idx === groups.length - 1}
        />
      ))}

      {loading ? <span className="loading loading-spinner mx-auto"></span> : null}
      {!loading && groups.length === 0 && (
        <p className="text-center text-gray-300">No groups yet</p>
      )}
    </div>
  );
};

export default GroupsList;
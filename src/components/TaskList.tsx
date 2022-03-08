import { VFC, memo } from 'react';
import { useQueryTasks } from '../hooks/useQueryTask';
import { TaskItemMemo } from './TaskItem';

const TaskList: VFC = () => {
  const { status, data } = useQueryTasks();
  console.log('rendered TaskList');

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error</div>;
  return (
    <div>
      {data?.map((task) => (
        <div key={task.id}>
          <ul>
            <TaskItemMemo task={task} />
          </ul>
        </div>
      ))}
    </div>
  );
};

export const TaskListMemo = memo(TaskList);
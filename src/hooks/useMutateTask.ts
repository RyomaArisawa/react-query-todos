import { useAppDispatch } from './../app/hooks';
import { useQueryClient, useMutation } from 'react-query';
import { Task, EditTask } from '../types/types';
import { resetEditedTask } from '../slices/todoSlice';
import axios from 'axios';

export const useMutateTask = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation(
    (task: Omit<EditTask, 'id'>) =>
      axios.post(`${process.env.REACT_APP_REST_URL}/tasks/`, task),
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks');
        if (previousTodos) {
          queryClient.setQueryData('tasks', [...previousTodos, res.data]);
        }
        dispatch(resetEditedTask());
      },
    }
  );

  const updateTaskMutation = useMutation(
    (task: EditTask) =>
      axios.put(`${process.env.REACT_APP_REST_URL}/tasks/${task.id}/`, task),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks');
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map((task) =>
              task.id === variables.id ? res.data : task
            )
          );
        }
        dispatch(resetEditedTask());
      },
    }
  );

  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tasks/${id}`),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks');
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          );
        }
        dispatch(resetEditedTask());
      },
    }
  );

  return { deleteTaskMutation, createTaskMutation, updateTaskMutation };
};

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import TaskCard from '../../components/TaskCard/TaskCard';

interface UserTask {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function UserTask() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${id}`);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error: ' + error);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [id]);

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <div className='w-full flex flex-col items-center'>
      <div className="w-full flex flex-col md:flex-row justify-between p-5 mb-10">
        <div className="w-full items-center md:w-1/2 ">
          <h2 className="text-xl text-center font-bold mb-4">Complete Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-5 ">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                userId={task.userId}
                id={task.id}
                title={task.title}
                completed={task.completed}
              />
            ))}
          </div>
        </div>
        
        
        <div className="w-full md:w-1/2 mt-4 md:mt-0 pl-5">
          <h2 className="text-xl text-center font-bold mb-4">Incompleted Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-5 ">
            {incompleteTasks.map((task) => (
              <TaskCard
                key={task.id}
                userId={task.userId}
                id={task.id}
                title={task.title}
                completed={task.completed}
              />
            ))}
          </div>
        </div>
      </div>
      {loading && <p>Loading tasks...</p>}
      
    </div>
  )
}
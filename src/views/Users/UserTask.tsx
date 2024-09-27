import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import TaskCard from '../../components/TaskCard/TaskCard';
import Popup from '../../components/PopUp/Popup';
import Button from '../../components/Button/Button';

interface UserTask {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function UserTask() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<UserTask[]>([])
  const [allTask, setAllTask] = useState<UserTask[]>([]);
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "" });
  const [formErrors, setFormErrors] = useState({ title: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({ title: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });
  const [searchInput, setSearchInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${id}`);
      setTasks(response.data);
      setAllTask(response.data)
      setCompleted(response.data)
      setLoading(false);
    } catch (error) {
      console.log('Error: ' + error);
      setLoading(false);
    }
  }

  const searchTasks = () => {
    if (!searchInput.trim()) {
      setTasks(allTask);
      return;
    }

    const filteredPosts = allTask?.filter(task => 
      task.title.toLowerCase().includes(searchInput.toLowerCase())
    ) || null;

    setTasks(filteredPosts);
    
    if (filteredPosts && filteredPosts.length === 0) {
      setError("No matching posts found.");
    } else {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors = {
      title: newTask.title.trim() === "" ? "Title is required" : "",
      
    };
    setFormErrors(errors);
    const isValid = Object.values(errors).every(error => error === "");
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const handleInputBlur = (e: any) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const createTasks = async () => {
    if (!validateForm()) return;
    try {
      console.log('Creating post');
      const res = await axios.post(`https://jsonplaceholder.typicode.com/todos`, {
        title: newTask.title,
        completed: false,
        userId: id
      });
      setTasks(prevTasks => [res.data, ...(prevTasks || [])]);
      setAllTask(prevTasks => [res.data, ...(prevTasks || [])]);
      setNewTask({ title: "" });
      setTouched({ title: false });
      console.log("New task created:", { ...res.data });
      setIsModalOpen(false);
      setPopupMessage({ content: "Task created successfully!", isShow: true });
      
      // Hide popup after 3 seconds
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
      }, 3000);
    } catch (error) {
      console.log(error);
      setPopupMessage({ content: "Error creating post. Please try again.", isShow: true });
      // Hide error popup after 3 seconds
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
      }, 3000);
    
    }
  }

  const filterCompleted = () => {
    if (!completed) {
      const completeTasks = allTask.filter(task => task.completed);
      setTasks(completeTasks);
    } else {
      setTasks(allTask); // Reset to show all tasks
    }
    setCompleted(!completed); // Toggle the state
  };
  

  const createTaskForm = () => {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col p-5">
          <div className="w-full"> 
            <span>Title</span>
            <input 
              className={`p-3 w-full mb-1 ${touched.title && formErrors.title ? 'border-red-500' : ''}`} 
              name="title" 
              value={newTask.title} 
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text" 
              placeholder="Title"
            />
            {touched.title && formErrors.title && <p className="text-red-500 text-sm mb-2">{formErrors.title}</p>}
          </div>
          
          <div className="w-full">
            <span>User ID</span>
            <input
              className="p-3 w-full mb-1 "
              type="number"
              name="userId"
              placeholder="User ID"
              value={id}
            />
          </div>
          <div className="w-full flex items-end align-bottom mt-4">
            <button 
              className={`${!isFormValid ? 'button-false w-full justify-center' : 'button-search w-full justify-center'}`} 
              onClick={createTasks}
              disabled={!isFormValid}
            >
              Submit
            </button>
            
          </div>
        </div>
      </div>
    )
  }



  useEffect(() => {
    loadTasks();
  }, [id]);

  useEffect(() => {
    if (allTask) {
      searchTasks();
    }
  }, [searchInput]);


  return (
    <div className='w-full flex flex-col items-center'>
      <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
      />

      
      <div className="grid grid-cols-2 p-5">
        <div className="flex justify-start mr-72">
          <Button
            name="Create task"
            type="create"
            modalTitle="Create task"
            modalContent={createTaskForm()}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            style="max-w-2xl"
          />
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search task"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={filterCompleted}>
            Which is complete
          </button>
        </div>
      </div>
        <div className="w-full items-center md:w-1/2 mb-10 z-1">
          {tasks.map((task) => (
              <TaskCard
                key={task.id}
                userId={task.userId}
                id={task.id}
                title={task.title}
                completed={task.completed}
              />
            ))}
          </div>
        {loading && <p>Loading tasks...</p>}
      </div>
      
  )
}
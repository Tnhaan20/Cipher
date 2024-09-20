import React from 'react'
import './TaskCard.css'

interface TaskCard{
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export default function TaskCard({userId, id, title, completed}: TaskCard) {

    return (
        <div className="w-full">
            <div className="task-card mx-5 h-[12rem]">
                <div className="flex-grow">
                    <p className='hidden'>User's ID: {userId}</p>
                    <p>ID: {id}</p>
                    <p className="mt-5">Task title: {title}</p>
                    <p>Completed?: {completed ? "✅" : "❌"}</p>
                </div>
            </div>
        </div>
    )
}

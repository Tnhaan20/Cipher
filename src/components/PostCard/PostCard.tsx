import { useState } from "react";
import "./PostCard.css";

interface PostCardProps {
  userId: number;
  id: number;
  title: string;
  body: string;
  onViewComments: (postId: number) => void;
  showComments: boolean;
  name: string;
}

export default function PostCard({

  id,
  title,
  body,
  onViewComments,
  showComments,
  name,
}: PostCardProps) {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="post-card">
        <div className="mb-5">
          <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 26 26"><g fill="none"><defs><mask id="pepiconsPencilPersonCheckmarkCircleFilled0"><path fill="#fff" d="M0 0h26v26H0z"/><g fill="#000" fillRule="evenodd" clipRule="evenodd"><path d="M9.8 6a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M6.3 8.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0"/><path d="M3.8 17.5c0-3.322 2.67-6.5 6-6.5s6 3.178 6 6.5v2a.5.5 0 0 1-1 0v-2c0-2.873-2.32-5.5-5-5.5s-5 2.627-5 5.5v2a.5.5 0 0 1-1 0zM21.154 6.563a.5.5 0 0 1 .194.68l-2.778 5a.5.5 0 0 1-.874-.486l2.778-5a.5.5 0 0 1 .68-.194"/><path d="M14.965 9.465a.5.5 0 0 1 .703-.078l2.778 2.223a.5.5 0 1 1-.625.78l-2.778-2.222a.5.5 0 0 1-.078-.703"/></g></mask></defs><circle cx="13" cy="13" r="13" fill="currentColor" mask="url(#pepiconsPencilPersonCheckmarkCircleFilled0)"/></g></svg> 
              <p className="pl-3 pt-1">
                {name}
              </p>
          </div>
        </div>
        <p>Title: {title}</p>
        <p className="mx-5 my-2">{body}</p>
        <div className="w-full grid grid-cols-3 mt-5 border-t border-1 border-[#3e4042]">
          <div className="flex justify-center">
            <button
              onClick={handleLike}
              className={`button-post w-full mx-2 flex items-center justify-center ${like ? "text-[#3ecf8e]" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-2">
                <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"
                >
                  <path d="M27.6 18.6v-7.2A5.4 5.4 0 0 0 22.2 6L15 22.2V42h20.916a3.6 3.6 0 0 0 3.6-3.06L42 22.74a3.6 3.6 0 0 0-3.6-4.14z" />
                  <path fill="currentColor" d="M15 22h-4.806C8.085 21.963 6.283 23.71 6 25.8v12.6a4.16 4.16 0 0 0 4.194 3.6H15z"
                  />
                </g>
              </svg>
              {like ? "Liked" : "Like"}
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => onViewComments(id)}
              className="w-full button-post mt-3 mx-2 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="mr-2" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1"/></svg>
              {showComments ? "Hide Comments" : "Comments"}
            </button>
          </div>
          <div className="flex justify-center">
            <button className="w-full button-post mt-3 mx-2 flex items-center justify-center">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" fillRule="evenodd" d="M12.207 2.232a.75.75 0 0 0 .025 1.06l4.146 3.958H6.375a5.375 5.375 0 0 0 0 10.75H9.25a.75.75 0 0 0 0-1.5H6.375a3.875 3.875 0 0 1 0-7.75h10.003l-4.146 3.957a.75.75 0 0 0 1.036 1.085l5.5-5.25a.75.75 0 0 0 0-1.085l-5.5-5.25a.75.75 0 0 0-1.06.025Z" clipRule="evenodd"/></svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

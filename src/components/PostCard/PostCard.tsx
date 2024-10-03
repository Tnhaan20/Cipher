import "./PostCard.css";
import { Link } from "react-router-dom";

interface PostCardProps {
  userId: number;
  id: number;
  title: string;
  body: string;
  name: string;
}

export default function PostCard({ id, title, body, name }: PostCardProps) {
  return (
    <>
      <Link to={`/posts/${id}`}>
        <div className="w-full flex justify-center">
          <div className="post-card flex flex-col h-full">
            <div className="flex-grow overflow-hidden">
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <p className="text-sm">By {name}</p>
                </div>
              </div>

              <h3 className="font-bold text-3xl mb-2 truncate">
                {title}
              </h3>
              <p className="overflow-hidden text-ellipsis line-clamp-3">
                {body}
              </p>
              <div className="pt-16 w-full flex justify-between">
                <span className="w-full flex justify-start items-center">
                  Read more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    className="ml-1"
                  >
                    <path
                      fill="currentColor"
                      d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

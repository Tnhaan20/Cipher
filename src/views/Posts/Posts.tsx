import axios from "axios";
import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard/PostCard";
import FuncButton from "../../components/Button/FuncButton";

export default function Posts() {
  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }
  interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
  }
  interface User {
    userId: number;
    name: string;
  }
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [allPosts, setAllPosts] = useState<Post[] | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: number]: boolean; }>({});
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (allPosts) {
      searchPosts();
    }
  }, [searchInput]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      if (response.data.length === 0) {
        setError("No posts found.");
        setPosts(null);
        setAllPosts(null);
      } else {
        setPosts(response.data);
        setAllPosts(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Error fetching posts. Please try again later.");
      setPosts(null);
      setAllPosts(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async (userId: number) => {
    if(!users[userId]) {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
        setUsers((prev) => ({...prev, [userId]: {userId: response.data.id, name: response.data.name}}))
      } catch (error) {
        console.log('E' + error);
      }
    }
  }

  const loadComment = async (postId: number) => {
    if (!comments[postId]) {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        setComments((prev) => ({ ...prev, [postId]: response.data }));
      } catch (error) {
        console.log("Error", error);
        return;
      }
    }
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const searchPosts = () => {
    if (!searchInput.trim()) {
      setPosts(allPosts);
      return;
    }

    const filteredPosts = allPosts?.filter(post => 
      post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      post.body.toLowerCase().includes(searchInput.toLowerCase())
    ) || null;

    setPosts(filteredPosts);
    
    if (filteredPosts && filteredPosts.length === 0) {
      setError("No matching posts found.");
    } else {
      setError(null);
    }
  };

  return (
    <div className="w-full pt-28">
      <div className="grid grid-cols-2 p-5">
        <div className="flex justify-start mr-72">
          <FuncButton
            name="Create post"
          />
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search posts by title or content"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center my-4">Loading posts...</p>
      ) : error ? (
        <p className="text-red-500 text-center my-4">{error}</p>
      ) : posts && posts.length > 0 ? (
        <div className="w-full flex flex-col items-center">
          {posts.map((post) => {
            loadUser(post.userId);
            return (
              <div key={post.id} className="w-[50%] bg-[#171717] rounded-lg overflow-hidden mb-4">
                <PostCard
                  userId={post.userId}
                  id={post.id}
                  title={post.title}
                  body={post.body}
                  onViewComments={loadComment}
                  showComments={visibleComments[post.id] || false}
                  name={users[post.userId]?.name || "Loading..."}
                />
                {visibleComments[post.id] && comments[post.id] && (
                  <div className="mt-4 ml-4">
                    <h3 className="text-lg font-semibold">
                      Comments of post {post.id}:
                    </h3>
                    {comments[post.id].map((comment) => (
                      <div key={comment.id} className="mt-2 p-2">
                        <p className="text-xl">
                          <strong>{comment.name}</strong> ({comment.email})
                        </p>
                        <p>{comment.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
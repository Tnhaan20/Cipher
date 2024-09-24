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
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: "" });

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

  const createPost = async() => {
    try {
      console.log('Createing post');
      const res = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title: newPost.title,
        body: newPost.body,
        userId: parseInt(newPost.userId)
      })
      console.log("New post created:", { ...res.data });
      setPosts((prevPosts => [res.data, ...(prevPosts || [])]))
      setAllPosts((prevPosts => [res.data, ...(prevPosts || [])]))
      setNewPost({title: "", body: "", userId: ""})
    } catch (error) {
        console.log(error);
        
    }
  }

  const handleInputChange = (error: any) => {
    const { name, value } = error.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };


  const createPostForm = () => {
    return(
      <div className="w-full h-full flex justify-start">
        <div className="flex flex-col p-5">
          <div> 
            <span>Title</span>
            <input className="p-3 ml-5 mb-5" name="title" value={newPost.title} onChange={handleInputChange} type="text" placeholder="Title"/>
          </div>
          <div> 
            <span>Body</span>
            <input className="p-3 ml-5 mb-5" name="body" value={newPost.body} onChange={handleInputChange} type="text" placeholder="Body"/>
          </div>
          <div>
            <span>User ID</span>
            <input
              className="p-3 ml-5 mb-5"
              type="number"
              name="userId"
              placeholder="User ID"
              value={newPost.userId}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="w-full flex items-end align-bottom">
          <button onClick={createPost}>
            Submit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pt-28">
      <div className="grid grid-cols-2 p-5">
        <div className="flex justify-start mr-72">
          <FuncButton
            name="Create post"
            type="create"
            modalTitle="Create post"
            modalContent={createPostForm()}
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
              <div key={post.id} className="w-[70%] bg-[#171717] rounded-lg overflow-hidden mb-4">
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
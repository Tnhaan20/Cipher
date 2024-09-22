import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostCard from '../../components/PostCard/PostCard';

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

export default function UserPost() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [visibleComments, setVisibleComments] = useState<{
    [key: number]: boolean;
  }>({});

  const loadPosts = async () => {
    try {
      const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  const loadComment = async (postId: number) => {
    if (!comments[postId]) {
      try {
        await axios
          .get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
          .then((response) => {
            setComments((prev) => ({ ...prev, [postId]: response.data }));
          });
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

  useEffect(() => {
    loadPosts();
  }, [id]);

  const searchPosts = async () => {
    if (!searchInput.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      // Sử dụng biểu thức kiểm tra xem đầu vào có phải là số nguyên không
      if (!/^\d+$/.test(searchInput)) {
        setError("Please enter a valid post ID (positive integer only).");
        setPosts([]);
        setLoading(false);
        return;
      }

      const id = parseInt(searchInput, 10);
      
      const response = await axios.get<Post>(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      setPosts([response.data]);
      setError(null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Post not found. Please try a different ID.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  interface User {
    id: number;
    name: string;
  }

  const [users, setUsers] = useState<{ [key: number]: User }>({});

  const loadUser = async (userId: number) => {
    if (!users[userId]) {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        setUsers(prev => ({ ...prev, [userId]: { id: userId, name: response.data.name } }));
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
      }
    }
  };

  const loadName = async (userId: number) => {
    if(!users[userId])
      await loadUser(userId)
    return users[userId].name || 'Unknown'
  }
  return (
    <div className="w-full">
      <div className="p-5">
        <div className="flex justify-center">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search post by id"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="button-search"
            onClick={searchPosts}
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center my-4">Loading posts...</p>
      ) : error ? (
        <p className="text-red-500 text-center my-4">{error}</p>
      ) : posts && posts.length > 0 ? (
        <div className="w-full flex flex-col items-center">
          {posts.map((post) => {
            // Load user information when rendering each post
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
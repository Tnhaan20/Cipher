import axios from "axios";
import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard/PostCard";
import Button from "../../components/Button/Button";
import Popup from "../../components/PopUp/Popup";

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
  const [formErrors, setFormErrors] = useState({ title: "", body: "", userId: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({ title: false, body: false, userId: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });
  const [commentFormErrors, setCommentFormErrors] = useState({ name: "", email: "", body: "" });
  const [isCommentFormValid, setIsCommentFormValid] = useState(false);
  const [commentFormTouched, setCommentFormTouched] = useState({ name: false, email: false, body: false });
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });

  useEffect(() => {
    loadPosts();
    loadUserID();
  }, []);

  useEffect(() => {
    if (allPosts) {
      searchPosts();
    }
  }, [searchInput]);

  const loadUserID = async () => {
    try {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/users`);
      const userList = res.data.map((user: any) => ({ userId: user.id, name: user.name }));
      setUsers(userList.reduce((map: any, user: any) => ({ ...map, [user.userId]: user }), {}));
    } catch (error) {
      console.log('Error loading users', error);
    }
  };
  

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
      post.title.toLowerCase().includes(searchInput.toLowerCase())
    ) || null;

    setPosts(filteredPosts);
    
    if (filteredPosts && filteredPosts.length === 0) {
      setError("No matching posts found.");
    } else {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors = {
      title: newPost.title.trim() === "" ? "Title is required" : "",
      body: newPost.body.trim() === "" ? "Body is required" : "",
      userId: newPost.userId.trim() === "" ? "User ID is required" : ""
    };
    setFormErrors(errors);
    const isValid = Object.values(errors).every(error => error === "");
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const handleInputBlur = (e: any) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  }

  const createPost = async () => {
    if (!validateForm()) return;
    try {
      console.log('Creating post');
      const res = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title: newPost.title,
        body: newPost.body,
        userId: parseInt(newPost.userId)
      });
      setPosts(prevPosts => [res.data, ...(prevPosts || [])]);
      setAllPosts(prevPosts => [res.data, ...(prevPosts || [])]);
      setNewPost({ title: "", body: "", userId: "" });
      setTouched({ title: false, body: false, userId: false });
      console.log("New post created:", { ...res.data });
      setIsModalOpen(false);
      setPopupMessage({ content: "Post created successfully!", isShow: true });
      
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

  const createPostForm = () => {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col p-5">
          <div className="w-full">
            <span>Title</span>
            <input
              className={`p-3 w-full mb-1 ${touched.title && formErrors.title ? 'border-red-500' : ''}`}
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              type="text"
              placeholder="Title"
            />
            {touched.title && formErrors.title && (
              <p className="text-red-500 text-sm mb-2">{formErrors.title}</p>
            )}
          </div>
  
          <div className="w-full">
            <span>Body</span>
            <textarea
              className={`p-3 w-full mb-1 ${touched.body && formErrors.body ? 'border-red-500' : ''}`}
              name="body"
              value={newPost.body}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Body"
            />
            {touched.body && formErrors.body && (
              <p className="text-red-500 text-sm mb-2">{formErrors.body}</p>
            )}
          </div>
          <div className="w-full">
            <span>User</span>
            <select
              title="UID"
              className={`p-3 w-full mb-1 ${touched.userId && formErrors.userId ? 'border-red-500' : ''}`}
              name="userId"
              value={newPost.userId}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            >
              <option value="">Select User</option>
              {Object.values(users).map((user: User) => (
                <option key={user.userId} value={user.userId}>
                  {user.name} - ID: {user.userId}
                </option>
              ))}
            </select>
            {touched.userId && formErrors.userId && (
              <p className="text-red-500 text-sm mb-2">{formErrors.userId}</p>
            )}
          </div>
  
          <div className="w-full flex items-end align-bottom mt-4">
            <button
              className={`${
                !isFormValid ? 'button-false w-full justify-center' : 'button-search w-full justify-center'
              }`}
              onClick={createPost}
              disabled={!isFormValid}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  const validateCommentForm = () => {
    const errors = {
      name: newComment.name.trim() === "" ? "Name is required" : "",
      email: newComment.email.trim() === "" ? "Email is required" : 
             !/\S+@\S+\.\S+/.test(newComment.email) ? "Invalid email format" : "",
      body: newComment.body.trim() === "" ? "Comment body is required" : ""
    };
    setCommentFormErrors(errors);
    const isValid = Object.values(errors).every(error => error === "");
    setIsCommentFormValid(isValid);
    return isValid;
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
    setCommentFormTouched(prev => ({ ...prev, [name]: true }));
    validateCommentForm();
  }

  const handleCommentInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setCommentFormTouched(prev => ({ ...prev, [name]: true }));
    validateCommentForm();
  }

  //Submit comment
  const submitComment = async (postId: number) => {
    if (!validateCommentForm()) return;
    try {
      const response = await axios.post(`https://jsonplaceholder.typicode.com/comments`, {
        postId,
        ...newComment
      });
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
      setNewComment({ name: "", email: "", body: "" });
      setCommentFormTouched({ name: false, email: false, body: false });
      setActiveCommentPostId(null);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  }

  //Comment Add
  const commentForm = (postId: number) => {
    return (
      <div className="w-full p-4 bg rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
        <div className="mb-2">
          <span>Name</span>
          <input
            className={`p-2 w-full ${commentFormTouched.name && commentFormErrors.name ? 'border-red-500' : ''}`}
            name="name"
            value={newComment.name}
            onChange={handleCommentInputChange}
            onBlur={handleCommentInputBlur}
            type="text"
            placeholder="Name"
          />
          {commentFormTouched.name && commentFormErrors.name && <p className="text-red-500 text-sm">{commentFormErrors.name}</p>}
        </div>
        <div className="mb-2">
          <span>Email</span>
          <input
            className={`p-2 w-full ${commentFormTouched.email && commentFormErrors.email ? 'border-red-500' : ''}`}
            name="email"
            value={newComment.email}
            onChange={handleCommentInputChange}
            onBlur={handleCommentInputBlur}
            type="email"
            placeholder="Email"
          />
          {commentFormTouched.email && commentFormErrors.email && <p className="text-red-500 text-sm">{commentFormErrors.email}</p>}
        </div>
        <div className="mb-2">
          <span>Comment Content</span>
          <textarea
            className={`p-2 w-full ${commentFormTouched.body && commentFormErrors.body ? 'border-red-500' : ''}`}
            name="body"
            value={newComment.body}
            onChange={handleCommentInputChange}
            onBlur={handleCommentInputBlur}
            placeholder="Comment"
          />
          {commentFormTouched.body && commentFormErrors.body && <p className="text-red-500 text-sm">{commentFormErrors.body}</p>}
        </div>
        <button
          className={`w-full p-2 ${!isCommentFormValid ? 'button-false justify-center' : 'button-search justify-center'}`}
          onClick={() => submitComment(postId)}
          disabled={!isCommentFormValid}
        >
          Submit Comment
        </button>
      </div>
    )
  }

  //Comment Add

  return (
    <>
    <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
    />
    <div className="fixed w-[30%] top-[0.65rem] left-48 z-50">
        <input
          type="text"
          className="w-[70%] p-2 pl-10 rounded-xl"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10.783 18.828a8.05 8.05 0 0 0 7.439-4.955a8.03 8.03 0 0 0-1.737-8.765a8.045 8.045 0 0 0-13.735 5.68c0 2.131.846 4.174 2.352 5.681a8.05 8.05 0 0 0 5.68 2.359m5.706-2.337l4.762 4.759"
          />
        </svg>
    </div>
    <div className="fixed top-0 right-40 z-50">
      <Button
        name="Create post"
        type="create"
        modalTitle="Create post"
        modalContent={createPostForm()}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        style="max-w-2xl"
      />
    </div>
    <div className="w-full">
        <div className="relative">
          <img 
            className="w-full h-96 object-cover blur-sm filter" 
            src="https://www.postplanner.com/hubfs/types-of-social-media-content.png" 
            alt="Blurred social media banner" 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-[#9ce036] mb-4">Post</h1>
            <p className="text-xl text-[#5629a9] mb-5">Discover and share amazing posts</p>
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
                    <button
                      className="w-full button-cmt rounded-3xl mb-4"
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    >
                      {activeCommentPostId === post.id ? "Cancel" : "Make a comment"}
                    </button>
                    {activeCommentPostId === post.id && commentForm(post.id)}
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
    </>
  );
}
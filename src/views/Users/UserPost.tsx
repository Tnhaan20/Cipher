import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostCard from '../../components/PostCard/PostCard';
import FuncButton from '../../components/Button/Button';
import Popup from '../../components/PopUp/Popup';

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
  id: number;
  userName: string;
  userEmail: string;
}

export default function UserPost() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [visibleComments, setVisibleComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: "" });
  const [formErrors, setFormErrors] = useState({ title: "", body: ""});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({ title: false, body: false, userId: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });
  const [commentFormErrors, setCommentFormErrors] = useState({ body: "" });
  const [isCommentFormValid, setIsCommentFormValid] = useState(false);
  const [commentFormTouched, setCommentFormTouched] = useState({ name: false, email: false, body: false });
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState({ content: "", isShow: false });

  const loadPosts = async () => {
    try {
      const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
      setPosts(response.data);
      setAllPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

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

  const loadUser = async (userId: number) => {
    if (!users[userId]) {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        setNewComment(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email
        }));
        setUsers(prev => ({ ...prev, [userId]: { id: userId, userName: response.data.name, userEmail: response.data.email } }));
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, [id]);

  useEffect(() => {
    if (allPosts) {
      searchPosts();
    }
  }, [searchInput]);

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
        userId: id
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
            {touched.title && formErrors.title && <p className="text-red-500 text-sm mb-2">{formErrors.title}</p>}
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
            {touched.body && formErrors.body && <p className="text-red-500 text-sm mb-2">{formErrors.body}</p>}
          </div>
          <div className="w-full">
            <span>User ID</span>
            <input
              className="p-3 w-full mb-1"
              type="number"
              name="userId"
              placeholder="User ID"
              value={id}
              readOnly
            />
          </div>
          <div className="w-full flex items-end align-bottom mt-4">
            <button 
              className={`${!isFormValid ? 'button-false w-full justify-center' : 'button-search w-full justify-center'}`} 
              onClick={createPost}
              disabled={!isFormValid}
            >
              Submit
            </button>
            
          </div>
        </div>
      </div>
    )
  }

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

  const validateCommentForm = () => {
    const errors = {
      
      body: newComment.body.trim() === "" ? "Comment body is required" : ""
    };
    setCommentFormErrors(errors);
    const isValid = Object.values(errors).every(error => error === "");
    setIsCommentFormValid(isValid);
    return isValid;
  };

  //Submit comment
  const submitComment = async (postId: number) => {
    if (!validateCommentForm()) return;
    try {
      const response = await axios.post(`https://jsonplaceholder.typicode.com/comments`, {
        postId,
        name: newComment.name,
        email: newComment.email,
        body: newComment.body
      });
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));
      setNewComment(prev => ({ ...prev, body: "" }));
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
            className="p-2 w-full"
            name="name"
            value={newComment.name}
            type="text"
            placeholder="Name"
            readOnly
          />
        </div>
        <div className="mb-2">
          <span>Email</span>
          <input
            className="p-2 w-full"
            name="email"
            value={newComment.email}
            type="email"
            placeholder="Email"
            readOnly
          />
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
  return (
    <div className="w-full">
      <Popup
      content={popupMessage.content}
      isShow={popupMessage.isShow}
      />
      <div className="grid grid-cols-2 p-5">
        <div className="col-span-1">
        <FuncButton
            name="Create post"
            type="create"
            modalTitle="Create post"
            modalContent={createPostForm()}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            style="max-w-2xl"
          />
        </div>
        <div className='w-full flex justify-end'>
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
        <div className="w-full grid grid-cols-3 gap-3 px-2 items-center">
          {posts.map((post) => {
            loadUser(post.userId);
            return (
              <div key={post.id} className="rounded-lg overflow-hidden mb-4">
                <PostCard
                  userId={post.userId}
                  id={post.id}
                  title={post.title}
                  body={post.body}
                  name={users[post.userId]?.userName || "Loading..."}
                />
                
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
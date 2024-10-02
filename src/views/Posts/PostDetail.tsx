import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "../../components/PopUp/Popup";

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
  name: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    body: "",
  });
  const [commentFormErrors, setCommentFormErrors] = useState({
    name: "",
    email: "",
    body: "",
  });
  const [isCommentFormValid, setIsCommentFormValid] = useState(false);
  const [commentFormTouched, setCommentFormTouched] = useState({
    name: false,
    email: false,
    body: false,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [isEditChanged, setIsEditChanged] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    content: "",
    isShow: false,
  });

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleOptionsMenu = () => {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const [postResponse, commentsResponse] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`),
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`),
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
      setEditedTitle(postResponse.data.title);
      setEditedBody(postResponse.data.body);
      const userResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${postResponse.data.userId}`
      );
      setUser(userResponse.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError("Error fetching post details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validateCommentForm = () => {
    const errors = {
      name: newComment.name.trim() === "" ? "Name is required" : "",
      email:
        newComment.email.trim() === ""
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(newComment.email)
          ? "Invalid email format"
          : "",
      body: newComment.body.trim() === "" ? "Comment body is required" : "",
    };
    setCommentFormErrors(errors);
    const isValid = Object.values(errors).every((error) => error === "");
    setIsCommentFormValid(isValid);
    return isValid;
  };

  const handleCommentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
    setCommentFormTouched((prev) => ({ ...prev, [name]: true }));
    validateCommentForm();
  };

  const handleCommentInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setCommentFormTouched((prev) => ({ ...prev, [name]: true }));
    validateCommentForm();
  };

  const submitComment = async () => {
    if (!validateCommentForm()) return;
    try {
      const response = await axios.post(
        `https://jsonplaceholder.typicode.com/comments`,
        {
          postId: parseInt(id as string),
          ...newComment,
        }
      );
      setComments((prev) => [...prev, response.data]);
      setNewComment({ name: "", email: "", body: "" });
      setCommentFormTouched({ name: false, email: false, body: false });
      setPopupMessage({ content: "Comment added successfully!", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setPopupMessage({ content: "Error adding comment.", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      setEditedTitle(value);
    } else if (name === "body") {
      setEditedBody(value);
    }
    setIsEditChanged(
      (post?.title !== value && name === "title") ||
      (post?.body !== value && name === "body") ||
      (post?.title !== editedTitle && name === "body") ||
      (post?.body !== editedBody && name === "title")
    );
  };

  const handleEdit = async () => {
    if (!isEditChanged) return;
    try {
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          title: editedTitle,
          body: editedBody,
        }
      );
      setPost(response.data);
      setIsEditModalOpen(false);
      setIsEditChanged(false);
      setPopupMessage({ content: "Post updated successfully!", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    } catch (error) {
      console.error("Error editing post:", error);
      setPopupMessage({ content: "Error updating post.", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setIsDeleteModalOpen(false);
      setPopupMessage({ content: "Post deleted successfully!", isShow: true });
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
        navigate("/posts"); // Redirect to posts list after deletion
      }, 3000);
    } catch (error) {
      console.error("Error deleting post:", error);
      setPopupMessage({ content: "Error deleting post.", isShow: true });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };



  if (loading) return <div className="line-wobble mt-10"></div>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;
  if (!post) return <p className="text-center my-4">Post not found.</p>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Popup content={popupMessage.content} isShow={popupMessage.isShow} />
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <p className="text-sm mb-2">By {user?.name || "Unknown Author"}</p>
        </div>
        <div className="col-span-1 flex justify-end space-x-2">
          {/* Like Button */}
          <button onClick={toggleLike} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill={isLiked ? "#ff69b4" : "none"}
              stroke={isLiked ? "#ff69b4" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          {/* Share Button */}
          <button className="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          {/* Options button */}
          <div className="relative mt-1">
            <button onClick={toggleOptionsMenu} className="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            {isOptionsMenuOpen && (
              <div className="absolute right-0 w-52 bg rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setIsOptionsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-[#b4b4b4] hover:text-[#16a34a]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 2048 2048"><path fill="currentColor" d="M384 1920h412l-32 128H256V128h128V0h128v128h256V0h128v128h256V0h128v128h256V0h128v128h128v648q-34 5-66 17t-62 31V256H384zM1848 896q42 0 78 15t64 41t42 63t16 79q0 39-15 76t-43 65l-717 717l-377 94l94-377l717-716q29-29 65-43t76-14m51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 692l-34 135l135-34z"/></svg>
                    <span className="ml-3">
                      Edit post
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setIsOptionsMenuOpen(false);
                    }}
                    className="w-full flex items-center text-left px-4 py-2 text-sm hover:bg-[#b4b4b4] hover:text-[#ff4e4e]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="currentColor" d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z"/></svg>
                    <span className="ml-3">
                      Delete Post  
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <h1 className="text-3xl items-center text-center font-bold mb-4">{post.title}</h1>
      <p className="mb-6 text-pretty">{post.body}</p>
      <div className="w-full flex justify-center pt-5 border-t border-gray-500">
      </div>
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="cmt">

      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 rounded">
          <p className="font-semibold">{comment.name} ({comment.email})</p>
          <p>{comment.body}</p>
        </div>
      ))}
      </div>


      <h3 className="text-xl font-semibold flex justify-center mt-6 mb-4">Add comment here</h3>
      <div className="cmt">
      <div className="space-y-4">
        <input
          className={`p-2 w-full border rounded ${
            commentFormTouched.name && commentFormErrors.name ? "border-red-500" : ""
          }`}
          name="name"
          value={newComment.name}
          onChange={handleCommentInputChange}
          onBlur={handleCommentInputBlur}
          type="text"
          placeholder="Name"
        />
        {commentFormTouched.name && commentFormErrors.name && (
          <p className="text-red-500 text-sm">{commentFormErrors.name}</p>
        )}

        <input
          className={`p-2 w-full border rounded ${
            commentFormTouched.email && commentFormErrors.email ? "border-red-500" : ""
          }`}
          name="email"
          value={newComment.email}
          onChange={handleCommentInputChange}
          onBlur={handleCommentInputBlur}
          type="email"
          placeholder="Email"
        />
        {commentFormTouched.email && commentFormErrors.email && (
          <p className="text-red-500 text-sm">{commentFormErrors.email}</p>
        )}

        <textarea
          className={`p-2 w-full border rounded ${
            commentFormTouched.body && commentFormErrors.body ? "border-red-500" : ""
          }`}
          name="body"
          value={newComment.body}
          onChange={handleCommentInputChange}
          onBlur={handleCommentInputBlur}
          placeholder="Comment"
          rows={4}
        />
        {commentFormTouched.body && commentFormErrors.body && (
          <p className="text-red-500 text-sm">{commentFormErrors.body}</p>
        )}

        <button
          className={`w-full p-2 rounded ${
            isCommentFormValid
              ? "button-search flex justify-center"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={submitComment}
          disabled={!isCommentFormValid}
        >
          Submit Comment
        </button>
      </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg flex items-center justify-center">
          <div className="modal p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <input
              className="w-full p-2 mb-4 border rounded"
              name="title"
              value={editedTitle}
              onChange={handleEditInputChange}
              placeholder="Title"
            />
            <textarea
              className="w-full p-2 mb-4 border rounded"
              name="body"
              value={editedBody}
              onChange={handleEditInputChange}
              placeholder="Body"
              rows={6}
            />
            <div className="flex justify-end space-x-2">
              <button
                className={`px-4 py-2 rounded ${
                  isEditChanged
                    ? "button-search"
                    : "button-false"
                }`}
                onClick={handleEdit}
                disabled={!isEditChanged}
              >
                Save Changes
              </button>
              <button
                className="button-cmt mt-2"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditedTitle(post?.title || "");
                  setEditedBody(post?.body || "");
                  setIsEditChanged(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg flex items-center justify-center">
          <div className="modal p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
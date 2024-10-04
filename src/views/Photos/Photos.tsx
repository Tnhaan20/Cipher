import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Photos.css";
import Popup from "../../components/PopUp/Popup";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function AlbumPhotos() {
  const botToken = import.meta.env.VITE_BOT_TOKEN;
  const chatId = import.meta.env.VITE_CHAT_ID;
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModalOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [uploadModal, setUploadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titleModal, setTitleModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: "", url: "", thumbnailUrl:"" });
  const [url, setUrl] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState({
    content: "",
    isShow: false,
  });
  const [isLoading, setIsLoading] = useState(false);


  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Photo[]>(
        `https://jsonplaceholder.typicode.com/albums/${id}/photos`
      );
      setPhotos(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to load photos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [id]);

  const open = () => {
    setUploadOpen(true);
  };

  const openModal = (index: number) => {
    setCurrentImg(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImg = () => {
    setCurrentImg((prev) => (prev + 1) % photos.length);
  };

  const prevImg = () => {
    setCurrentImg((next) => (next + 1) % photos.length);
  };

  const handleDrag = useCallback(
    (e: React.DragEvent<HTMLFormElement | HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLFormElement | HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files[0]);
      }
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = async (file: File) => {
    if (file.type.startsWith("image/")) {
      setUploadedFile(file);
      console.log(file);
      console.log("aaaa");
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      alert("Please upload an image file.");
    }
  };

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadedFile) {
      try {
        const fileId = await uploadFileToCDN();
        const secureUrl = await getImgFromCDN(fileId);
        setUrl(secureUrl);
        setUploadOpen(false);
        setTitleModal(true);
      } catch (error) {
        console.error("Error during file upload:", error);
        alert("Failed to upload the file. Please try again.");
      }
    }
  };

  const handleTitleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadedFile && newPhoto.title.trim() && url) {
      try {
        const uploadedPhoto = await uploadImgToAPI();
        setPhotos(prevPhotos => [uploadedPhoto, ...prevPhotos]);
        setTitleModal(false);
        setUploadedFile(null);
        setPreviewUrl(null);
        setNewPhoto({ title: "", url: "", thumbnailUrl: "" });
        setPopupMessage({ content: "Photo added successfully!", isShow: true });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      } catch (error) {
        console.error("Error uploading photo:", error);
        setPopupMessage({
          content: "Failed to upload the photo. Please try again.",
          isShow: true,
        });
        setTimeout(() => {
          setPopupMessage({ content: "", isShow: false });
        }, 3000);
      }
    } else {
      setPopupMessage({
        content: "Please enter a valid title and ensure the image is uploaded.",
        isShow: true,
      });
      setTimeout(() => {
        setPopupMessage({ content: "", isShow: false });
      }, 3000);
    }
  };

  const uploadFileToCDN = async (): Promise<string> => {
    if (!uploadedFile) {
      throw new Error("No file selected");
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("bot_token", botToken);
      formData.append("chat_id", chatId);
      formData.append("document", uploadedFile);
      const response = await axios.post(
        "https://cdn.thinology.id.vn/send",
        formData
      );
      console.log("File uploaded successfully:", response.data);
      return response.data.data.id;
    } catch (error) {
      console.error("Error uploading to CDN:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getImgFromCDN = async (fileId: string): Promise<string> => {
    try {
      const response = await axios.get(
        `https://cdn.thinology.id.vn/url?bot_token=${botToken}&file_id=${fileId}`
      );
      console.log("File URL retrieved successfully:", response.data);
      return response.data.data.secure_url;
    } catch (error) {
      console.error("Error getting image URL from CDN:", error);
      throw error;
    }
  };

  const uploadImgToAPI = async (): Promise<Photo> => {
    try {
      const response = await axios.post<Photo>(
        "https://jsonplaceholder.typicode.com/photos",
        {
          albumId: Number(id),
          title: newPhoto.title,
          url: url,
          thumbnailUrl: url,
        }
      );
      console.log("Photo posted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading photo to API:", error);
      throw error;
    }
  };

  const handleEditClick = (photo: Photo) => {
    setCurrentPhoto(photo);
    setEditedTitle(photo.title);
    setEditModal(true);
  };

  const handleDeleteClick = (photo: Photo) => {
    setCurrentPhoto(photo);
    setDeleteModal(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPhoto) return;

    try {
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com/photos/${currentPhoto.id}`,
        {
          title: editedTitle,
          url: url || currentPhoto.url,
          thumbnailUrl: url || currentPhoto.thumbnailUrl,
        }
      );

      if (response.status === 200) {
        setPhotos(
          photos.map((photo) =>
            photo.id === currentPhoto.id
              ? {
                  ...photo,
                  title: editedTitle,
                  url: url || photo.url,
                  thumbnailUrl: url || photo.thumbnailUrl,
                }
              : photo
          )
        );
        setPopupMessage({
          content: "Photo edited successfully!",
          isShow: true,
        });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error editing photo:", error);
      setPopupMessage({
        content: "Failed to edit photo. Please try again.",
        isShow: true,
      });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  const handleDelete = async () => {
    if (!currentPhoto) return;

    try {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/photos/${currentPhoto.id}`
      );

      if (response.status === 200) {
        setPhotos(photos.filter((photo) => photo.id !== currentPhoto.id));
        setPopupMessage({
          content: "Photo deleted successfully!",
          isShow: true,
        });
        setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      setPopupMessage({
        content: "Failed to delete photo. Please try again.",
        isShow: true,
      });
      setTimeout(() => setPopupMessage({ content: "", isShow: false }), 3000);
    }
  };

  return (
    <div className="w-full">
      <Popup
        content={popupMessage.content}
        isShow={popupMessage.isShow}
      ></Popup>
      <div className="fixed top-0 right-40 z-50">
        <button className="button-search" onClick={open}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path
                stroke-linejoin="round"
                d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"
              />
              <path
                stroke-linejoin="round"
                d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"
              />
              <path stroke-miterlimit="10" d="M18.707 15v5" />
              <path
                stroke-linejoin="round"
                d="m21 17.105l-1.967-1.967a.46.46 0 0 0-.652 0l-1.967 1.967"
              />
            </g>
          </svg>
          <span className="ml-3">Upload photo</span>
        </button>
      </div>

      <div className="fixed top-4 left-72 z-50">
        <h1 className="text-xl font-bold">
          {photos.length} photos of album {id}
        </h1>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {loading ? (
        <p className="text-center">Loading photos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-5 py-5">
          {photos.map((photo, index) => (
            <div key={photo.id} className="photo-card relative">
              <img
                loading="lazy"
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-40 object-cover mb-2 rounded cursor-pointer"
                onClick={() => openModal(index)}
              />
              <p className="text-sm truncate">{photo.title}</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="relative w-full h-full flex flex-col justify-center items-center">
            <div className="absolute top-1 right-10 flex space-x-2">
              <button
                onClick={() => handleEditClick(photos[currentImg])}
                className="button-search"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(photos[currentImg])}
                className="button-search hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            <div className="max-w-4xl w-full h-[80vh] flex items-center justify-center">
              <button
                onClick={prevImg}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 font-extrabold px-4 py-8 rounded-l"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 1024 1024"
                >
                  <path fill="currentColor" d="M672 192L288 511.936L672 832z" />
                </svg>
              </button>
              <img
                loading="lazy"
                src={photos[currentImg].url}
                alt={photos[currentImg].title}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={nextImg}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 font-extrabold px-4 py-8 rounded-r"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 1024 1024"
                >
                  <path fill="currentColor" d="M384 192v640l384-320.064z" />
                </svg>
              </button>
            </div>
            <div className="px-14 py-2 bg-[#18191a] mt-4">
              <p className="font-extrabold text-[#e0e2e6] text-center">
                {photos[currentImg].title}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 font-extrabold text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {uploadModal && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setUploadOpen(false)}
              className="absolute top-10 right-10 text-black text-xl z-10"
            >
              &times;
            </button>
            <form
              className="modal"
              onSubmit={handleNext}
              onDragEnter={handleDrag}
            >
              <div className="container">
                <div className="folder">
                  <div className="front-side">
                    <div className="tip"></div>
                    <div className="cover"></div>
                  </div>
                  <div className="back-side cover"></div>
                </div>

                <label
                  htmlFor="file-input"
                  className="custom-file-upload"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    className="title"
                    type="file"
                    accept="image/*"
                    required
                    id="file-input"
                    onChange={handleChange}
                  />
                  Choose a picture
                </label>
              </div>
              {previewUrl && (
                <div className="preview-container">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                </div>
              )}
              {isLoading ? (
                <div className="w-full flex justify-center">
                  
                <div className="spinner">
                  <div className="loader l1"></div>
                  <div className="loader l2"></div>
                </div>
                </div>
              ) : (
                uploadedFile && (
                  <button
                    type="submit"
                    className="button-search justify-center w-full"
                  >
                    Next
                  </button>
                )
              )}
            </form>
          </div>
        </div>
      )}

      {titleModal && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setTitleModal(false)}
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <form
              onSubmit={handleTitleSubmit}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-black">
                Add a title
              </h2>
              <input
                type="text"
                value={newPhoto.title}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, title: e.target.value })
                }
                placeholder="Enter image title"
                className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
                required
              />
              {previewUrl && (
                <div className="preview-container mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                </div>
              )}
              <button type="submit" className="w-full justify-center button-search">
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {editModal && currentPhoto && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <form onSubmit={handleEdit} className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4 text-black">Edit Photo</h2>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter new title"
                className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
                required
              />
              <label
                htmlFor="file-input"
                className={`drop-container ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <span className="drop-title">Drop files here</span>
                or
                <input
                  type="file"
                  accept="image/*"
                  required
                  id="file-input"
                  onChange={handleChange}
                />
              </label>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mb-4 max-w-full h-40 object-cover"
                />
              ) : (
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.title}
                  className="mb-4 max-w-full h-40 object-cover"
                />
              )}
              <button type="submit" className="button-search w-full justify-center">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteModal && currentPhoto && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setDeleteModal(false)}
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">Delete Photo</h2>
            <p className="mb-4 text-black">
              Are you sure you want to delete this photo?
            </p>
            <div className="w-full flex justify-center">

            <img
              src={currentPhoto.thumbnailUrl}
              alt={currentPhoto.title}
              className="mb-4 max-w-full h-40 object-cover"
              />
              </div>
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteModal(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

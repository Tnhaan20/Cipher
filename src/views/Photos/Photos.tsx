import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Photos.css'

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function AlbumPhotos() {
  const botToken = import.meta.env.VITE_BOT_TOKEN
  const chatId = import.meta.env.VITE_CHAT_ID
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModalOpen] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)
  const [uploadModal, setUploadOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titleModal, setTitleModal] = useState(false)
  const [newPhoto, setNewPhoto] = useState({title: ""});
  const [fileID, setFileID] = useState("")
  const [url, setUrl] = useState("")

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
    setUploadOpen(true)
  }

  const close = () => {
    setUploadOpen(false)
  }

  const openModal = (index: number) => {
    setCurrentImg(index);
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const nextImg = () => {
    setCurrentImg((prev)=> (prev+1)%photos.length)
  }

  const prevImg = () => {
    setCurrentImg((next)=> (next+1)% photos.length)
  }

  const handleDrag = useCallback((e: React.DragEvent<HTMLFormElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLFormElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = async (file: File) => {
    if (file.type.startsWith('image/')) {
      setUploadedFile(file);
      console.log(file);
      console.log('aaaa');
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      alert('Please upload an image file.');
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
        console.error('Error during file upload:', error);
        alert('Failed to upload the file. Please try again.');
      }
    }
  };

  const handleTitleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadedFile && newPhoto.title.trim() && url) {
      try {
        await uploadImgToAPI();
        setTitleModal(false);
        setUploadedFile(null);
        setPreviewUrl(null);
        setNewPhoto({title: ""});
        setUrl("");
        loadPhotos(); // Reload photos after successful upload
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload the photo. Please try again.');
      }
    } else {
      alert('Please enter a valid title for the image and ensure the image URL is available.');
    }
  };

  const uploadFileToCDN = async (): Promise<string> => {
    if (!uploadedFile) {
      throw new Error('No file selected');
    }
    try {
      const formData = new FormData();
      formData.append('bot_token', botToken);
      formData.append('chat_id', chatId);
      formData.append('document', uploadedFile);
      const response = await axios.post('https://cdn.thinology.id.vn/send', formData);
      console.log('File uploaded successfully:', response.data);
      return response.data.data.id;
    } catch (error) {
      console.error('Error uploading to CDN:', error);
      throw error;
    }
  }
  
  const getImgFromCDN = async (fileId: string): Promise<string> => {
    try {
      const response = await axios.get(`https://cdn.thinology.id.vn/url?bot_token=${botToken}&file_id=${fileId}`);
      console.log('File URL retrieved successfully:', response.data);
      return response.data.data.secure_url;
    } catch (error) {
      console.error('Error getting image URL from CDN:', error);
      throw error;
    }
  }

  const uploadImgToAPI = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/photos', {
        albumId: id,
        title: newPhoto.title,
        url: url,
        thumbnailUrl: url,
      });
      console.log('Photo posted successfully:', response.data);
    } catch (error) {
      console.error('Error uploading photo to API:', error);
      throw error;
    }
  };

  return (
    <div className="w-full">
      <div className="fixed top-0 right-40 z-50">
        <button className='button-search' onClick={open}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path stroke-linejoin="round" d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"/><path stroke-linejoin="round" d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"/><path stroke-miterlimit="10" d="M18.707 15v5"/><path stroke-linejoin="round" d="m21 17.105l-1.967-1.967a.46.46 0 0 0-.652 0l-1.967 1.967"/></g></svg>
        <span className='ml-3'>Upload photo</span>
        </button>
      </div>
      
      <div className="fixed top-4 left-72 z-50">
        <h1 className="text-xl font-bold">{photos.length} photos of album {id}</h1>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {loading ? (
        <p className="text-center">Loading photos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-5 py-5">
          {photos.map((photo, index) => (
            <div key={photo.id} className="photo-card cursor-pointer" onClick={() => openModal(index)}>
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <p className="text-sm truncate">{photo.title}</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg flex items-center justify-center z-50">
          <div className="relative w-full h-full flex flex-col justify-center items-center">
            <div className="max-w-4xl w-full h-[80vh] flex items-center justify-center">
              <button 
                onClick={prevImg} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white px-4 py-8 rounded-l"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M672 192L288 511.936L672 832z"/></svg>
              </button>
              <img
                src={photos[currentImg].url}
                alt={photos[currentImg].title}
                className="max-w-full max-h-full object-contain"
              />
              <button 
                onClick={nextImg} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white px-4 py-8 rounded-r"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M384 192v640l384-320.064z"/></svg>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-white text-center">{photos[currentImg].title}</p>
            </div>
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button 
              onClick={() => setUploadOpen(false)} 
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <form className="form" onSubmit={handleNext} onDragEnter={handleDrag}>
              <span className="form-title">Upload your file</span>
              <p className="form-paragraph">
                File should be an image
              </p>
              <label 
                htmlFor="file-input" 
                className={`drop-container ${dragActive ? 'drag-active' : ''}`}
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
              {previewUrl && (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                </div>
              )}
              {uploadedFile && (
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                  Next
                </button>
              )}

            </form>
          </div>
        </div>
      )}

{titleModal && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
          <button 
            onClick={() => setTitleModal(false)} 
            className="absolute top-2 right-2 text-black text-xl"
          >
            &times;
          </button>
          <form onSubmit={handleTitleSubmit} className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-black">Add a title</h2>
            {previewUrl && (
              <div className="preview-container mb-4">
                <img src={previewUrl} alt="Preview" className="preview-image"/>
              </div>
            )}
            <input
              type="text"
              value={newPhoto.title}
              onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
              placeholder="Enter image title"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
              Upload
            </button>
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
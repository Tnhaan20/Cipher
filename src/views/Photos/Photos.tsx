import React, { useEffect, useState } from 'react';
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
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModalOpen] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)

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



  return (
    <div className="w-full text-white pt-28 px-4 min-h-screen">
      
      <div className="w-full flex justify-center p-5">
        <h1 className="text-3xl font-bold">Album {id}</h1>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {loading ? (
        <p className="text-center">Loading photos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
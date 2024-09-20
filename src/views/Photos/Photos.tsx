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
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
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
    </div>
  );
}
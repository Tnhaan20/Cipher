import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlbumCard from "../../components/AlbumCard/AlbumCard";

export default function UserAlbum() {
  interface UserAlbum {
    userId: number;
    id: number;
    title: string;
  }

  const { id } = useParams<{ id: string }>();
  const [albums, setAlbums] = useState<UserAlbum[] | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserAlbums();
  }, [id]);

  const loadUserAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jsonplaceholder.typicode.com/albums?userId=${id}`);
      if (response.data.length === 0) {
        setError("No albums found for this user.");
        setAlbums(null);
      } else {
        setAlbums(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      setError("Error fetching albums. Please try again later.");
      setAlbums(null);
    } finally {
      setLoading(false);
    }
  };

  const searchAlbum = async () => {
    if (!searchInput.trim()) {
      loadUserAlbums();
      return;
    }

    try {
      setLoading(true);
      if (!/^\d+$/.test(searchInput)) {
        setError("Please enter a valid album ID (positive integer only).");
        setAlbums(null);
        return;
      }

      const albumId = parseInt(searchInput, 10);
      const response = await axios.get<UserAlbum>(
        `https://jsonplaceholder.typicode.com/albums/${albumId}`
      );
      
      if (response.data.userId.toString() !== id) {
        setError("Album not found for this user. Please try a different ID.");
        setAlbums(null);
      } else {
        setAlbums([response.data]);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching album:", error);
      setError("Album not found. Please try a different ID.");
      setAlbums(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      <div className="w-full flex justify-center p-5">
        <div className="flex">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search album by id"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="button-search"
            onClick={searchAlbum}
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center my-4">Loading albums...</p>
      ) : error ? (
        <p className="text-red-500 text-center my-4">{error}</p>
      ) : albums && albums.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 p-5">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              userId={album.userId}
              id={album.id}
              title={album.title}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
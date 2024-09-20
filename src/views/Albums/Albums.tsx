import axios from "axios";
import React, { useEffect, useState } from "react";
import AlbumCard from "../../components/AlbumCard/AlbumCard";

interface Album {
  userId: number;
  id: number;
  title: string;
}


export default function Album() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Album[]>(
        "https://jsonplaceholder.typicode.com/albums"
      );
      setAlbums(response.data);
      setError(null);
    } catch (error) {
      console.error("Error loading albums:", error);
      setError("Failed to load albums. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const searchAlbum = async () => {
    if (!searchInput.trim()) {
      loadAlbums();
      return;
    }

    try {
      setLoading(true);
      const id = parseInt(searchInput);
      if (!/^\d+$/.test(searchInput)) {
        setError("Please enter a valid post ID (positive integer only).");
        setAlbums([]);
        setLoading(false);
        return;
      }
      const response = await axios.get<Album>(
        `https://jsonplaceholder.typicode.com/albums/${id}`
      );
      setAlbums([response.data]);
      setError(null);
    } catch (error) {
      console.error("Error fetching album:", error);
      setError("Album not found. Please try a different ID.");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white pt-28 px-4 min-h-screen">
      <div className="grid grid-cols-2 p-5">
        <div>
          <h1 className="text-2xl pl-40 pt-3 text-[#2c9063] font-bold">ALBUMS</h1>
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search albums by id"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={searchAlbum}
            className="button-search"
          >
            Search
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      <div className="grid grid-cols-2 gap-3 p-5">
      {loading ? (
          <p className="col-span-full text-center">Loading albums...</p>
        ) : albums.length > 0 ? (
          albums.map((album) => (
            <AlbumCard
              key={album.id}
              userId={album.userId}
              id={album.id}
              title={album.title}
            />
          ))
        ) : (
          <p className="col-span-full text-center">No albums found.</p>
        )}
      </div>
    </div>
  );
}
import axios from "axios";
import { useEffect, useState } from "react";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import FuncButton from "../../components/Button/FuncButton";

interface Album {
  userId: number;
  id: number;
  title: string;
}

export default function Album() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
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
      setAllAlbums(response.data);
      setError(null);
    } catch (error) {
      console.error("Error loading albums:", error);
      setError("Failed to load albums. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const searchAlbum = () => {
    if (!searchInput.trim()) {
      setAlbums(allAlbums);
      setError(null);
      return;
    }

    const filteredAlbums = allAlbums.filter(album =>
      album.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (filteredAlbums.length === 0) {
      setError("No albums found matching the search criteria.");
    } else {
      setError(null);
    }

    setAlbums(filteredAlbums);
  };

  useEffect(() => {
    searchAlbum();
  }, [searchInput]);

  return (
    <div className="w-full text-white pt-28 px-4 min-h-screen">
      <div className="grid grid-cols-2 p-5">
        <div className="mr-72">
          <FuncButton
            name="Create album"
          />
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            className="search-input p-2 h-11 mt-2 mr-2 w-96"
            placeholder="Search albums by title"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          
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
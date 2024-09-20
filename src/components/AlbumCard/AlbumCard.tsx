import React from "react";
import { Link } from "react-router-dom";
import "./AlbumCard.css";

interface AlbumProps {
  userId: number;
  id: number;
  title: string;
}

export default function AlbumCard({ userId, id, title }: AlbumProps) {
  return (
    <div className="w-full h-full">
      <div className="album-card h-full flex flex-col">
        <div className="flex-grow p-4">
          <p className="mb-2">ID: {id}</p>
          <p className="mb-2 font-semibold">Album's Title: {title}</p>
          <p className="hidden mt-auto">Posted by user: {userId}</p>
        </div>
        <div className="mt-auto">
          <Link
            to={`/albums/${id}/photos`}
            className="button-search"
          >
            View photos of album
          </Link>
        </div>
      </div>
    </div>
  );
}
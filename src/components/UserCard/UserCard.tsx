import './UserCard.css'
import { Link } from 'react-router-dom'

interface UserCard{
    id: number;
    name: string;
    email: string;
    phone: string;
}

export default function UserCard({id, name, email, phone}: UserCard) {
  return (
    <div className="user-card w-full h-full flex flex-col border rounded-lg shadow-sm">
      <div className="flex-grow">
        <p className="font-semibold">User's ID: {id}</p>
        <p className="text-lg font-bold mt-2">{name}</p>
        <p className="mt-4">Email: {email}</p>
        <p>Phone: {phone}</p>
      </div>
      <div className="mt-4">
        <Link
          to={`/users/${id}/detail`}
          className="button-search inline-block"
        >
          View user detail
        </Link>
      </div>
    </div>
  )
}

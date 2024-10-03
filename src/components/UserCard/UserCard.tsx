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
      <div className="w-full flex items-center justify-center">
      <div className="user-card h-full flex flex-col">
        <div className="flex-grow">
          <p>User's ID: {id}</p>
          <p>Name: {name}</p>
          <p className="mt-5">Email: {email}</p>
          <p>Phone: {phone}</p>
        </div>
        <div className="w-full flex justify-end mt-auto">
          <Link
            to={`/users/${id}/detail`}
            className="button-search"
          >
            View user detail
          </Link>
          </div>
        </div>
      </div>
    )
}

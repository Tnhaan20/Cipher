import { ReactNode } from "react"

interface Modal{
    isOpen: boolean
    isClose: () => void
    title: string
    children: ReactNode

}

export default function Modal( {isOpen, isClose, title, children}: Modal) {

    if(!isOpen)
        return null

  return (
    <div className="fixed bg inset-0 flex items-center justify-center z-50">
      
      <div className="modal relative max-w-md w-full">
        <h2 className="text-3xl text-center font-bold">{title}</h2>
        <button
          onClick={isClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22A10 10 0 0 1 4.926 4.926a10.004 10.004 0 1 1 14.148 14.148A9.936 9.936 0 0 1 12 22Zm-8-9.828A8 8 0 1 0 4 12v.172ZM9.409 16l-1.41-1.41L10.59 12L8 9.41L9.41 8L12 10.59L14.59 8L16 9.41L13.41 12L16 14.59L14.592 16L12 13.41L9.41 16h-.001Z"/></svg>
          
        </button>
        {children}
        </div>
    </div>
  )
}

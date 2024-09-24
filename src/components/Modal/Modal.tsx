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
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={isClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        {children}
        </div>
    </div>
  )
}

import './App.css'
import Posts from './views/Posts/Posts'

export default function App(){
  return(
    <div className='body'>
      {/* <h1 className='text-center max-w-4xl px-4'>
        Lấy API từ trang https://jsonplaceholder.typicode.com/ để tập luyện với React, sử dụng TailwindCSS để định dạng lại UI
      </h1> */}
      <Posts/>
    </div>
  )
}
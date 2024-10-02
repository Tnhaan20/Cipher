import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import Sidebar from './components/Navbar/Navbar.tsx'
import Album from './views/Albums/Albums.tsx'
import User from './views/Users/Users.tsx'
import Photos from './views/Photos/Photos.tsx'
import UserDetail from './views/Users/UserDetail.tsx'
import UserPost from './views/Users/UserPost.tsx'
import UserTask from './views/Users/UserTask.tsx'
import UserAlbum from './views/Users/UserAlbum.tsx'
import PostDetail from './views/Posts/PostDetail.tsx'

// Layout component to wrap the sidebar and main content
const Layout = () => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<App/>} />
          <Route path='/posts/:id' element={<PostDetail/>} />
          <Route path='/albums' element={<Album/>} />
          <Route path='/users' element={<User/>} />
          <Route path='/albums/:id/photos' element={<Photos/>} />
          <Route path='/users/:id/detail' element={<UserDetail/>}>
            <Route index element={<UserPost/>}/>
            <Route path='tasks' element={<UserTask/>}/>
            <Route path='albums' element={<UserAlbum/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
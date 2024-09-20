import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Navbar/Navbar.tsx'
import Posts from './views/Posts/Posts.tsx'
import Album from './views/Albums/Albums.tsx'
import User from './views/Users/Users.tsx'
import Photos from './views/Photos/Photos.tsx'
import UserDetail from './views/Users/UserDetail.tsx'
import UserPost from './views/Users/UserPost.tsx'
import UserTask from './views/Users/UserTask.tsx'
import UserAlbum from './views/Users/UserAlbum.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/albums' element={<Album/>} />
        <Route path='/users' element={<User/>} />
        <Route path='/albums/:id/photos' element={<Photos/>} />
        <Route path='/users/:id/detail' element={<UserDetail/>}>
          <Route index element={<UserPost/>}/>
          <Route path='tasks' element={<UserTask/>}/>
          <Route path='albums' element={<UserAlbum/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
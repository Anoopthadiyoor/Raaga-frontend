import {Route,Routes} from 'react-router-dom'
import { useState } from 'react'
import { ToastContainer} from 'react-toastify';
import './App.css'
import SongDetails from './Pages/SongDetails'
import Account from './Pages/Account'
import Explore from './Pages/Explore'
import Home from './Pages/Home'
import Library from './Pages/Library'
import Login from './Pages/Login'
import Playlist from './Pages/Playlist'
import Register from './Pages/Register'
import Search from './Pages/Search';
import MusicPlayer from './Components/MusicPlayer';
import BottomNavigation from './Components/BottomNavigation';
import Header from './Components/Header';
import AdminDashboard from './Pages/AdminDashboard'
import AdminLogin from './Pages/Adminlogin';
import AddSong from './Pages/AddSong';

function App() {

  return (
    <>

    {/* Set path */}
    <Routes>
      <Route path='' element={<Login/>}/>
      <Route path='home' element={<Home/>}/>
      <Route path='library' element={<Library/>}/>
      <Route path='playlists' element={<Playlist/>}/>
      <Route path="/playlist/:id" element={<Playlist />} />
      <Route path='register' element={<Register/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='explore' element={<Explore/>}/>
      <Route path='account' element={<Account/>}/>
      <Route path='/song/:id' element={<SongDetails/>}/>
      <Route path='search' element={<Search/>}/>
      <Route path='admin-login' element={<AdminLogin/>}/>
      <Route path='admin-dashboard' element={<AdminDashboard/>}/>
      <Route path='admin/add-song' element={<AddSong/>}/>

    </Routes>
    
    <MusicPlayer/>

        <ToastContainer position="top-right"  autoClose={3000} theme="colored"/>

    </>
  )
}

export default App

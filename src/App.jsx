import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import TaskApp from './pages/TaskApp'
import TaskView from './pages/TaskView'
export default function App() {
  return (
    <div>
        <BrowserRouter>
         <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/taskapp' element={<TaskApp/>}></Route>
          <Route path='/taskview' element={<TaskView/>}></Route>
         </Routes>
        </BrowserRouter>
    </div>
  )
}

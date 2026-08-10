

import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "./Login";
import Register from "./Register";
import Cocktails from "./Cocktails";
import RandomCocktail from "./RandomCocktail";
import Search from "./Search";
import CreateCocktail from "./CreateCocktail";


function ProtectedRoute({ children }: {children: React.ReactNode }){
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

function App() {

  return (
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element ={<Navigate to="/login" replace />} />
      <Route path="/login" element ={<Login />} />
      <Route path="/register" element = {<Register />} />
      <Route path="/home" element={
              <ProtectedRoute>
              <Cocktails />
              </ProtectedRoute>
          }
        />
      <Route path="/random" element={
              <ProtectedRoute>
                <RandomCocktail />
              </ProtectedRoute>
      }
      />  
      <Route path="/search" 
             element = {
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
             }
      />
      <Route path="/post" element={
        <ProtectedRoute>
          <CreateCocktail />
        </ProtectedRoute>
      } />       
    </Routes>
      
    </BrowserRouter>
  )
}

export default App;
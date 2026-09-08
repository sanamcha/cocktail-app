

import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "./Login";
import Register from "./Register";
import Cocktails from "./Cocktails";
import CocktailDetails from "./CocktailDetails";
import RandomCocktail from "./RandomCocktail";
import PostCocktail from "./PostCocktail";
import PostCocktailDetails from "./PostCocktailDetails";
import PostFavorites from "./PostFavorites";
import Search from "./Search";


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
      <Route path="/cocktails/:id" element={
              <ProtectedRoute>
                <CocktailDetails />
              </ProtectedRoute>
      }
      />
      <Route path="/random" element={
              <ProtectedRoute>
                <RandomCocktail />
              </ProtectedRoute>
      }
      />  
      <Route path="/post" element={
              <ProtectedRoute>
                <PostCocktail />
              </ProtectedRoute>
      }
      />
      <Route path="/postdetails/:id" element={
              <ProtectedRoute>
                <PostCocktailDetails />
              </ProtectedRoute>
      }
      />
      <Route path="/favorites" element={
              <ProtectedRoute>
                <PostFavorites />
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
    </Routes>
      
    </BrowserRouter>
  )
}

export default App;
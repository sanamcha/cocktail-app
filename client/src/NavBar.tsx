import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

//   re-checks after navigation, such as login -> /home
const isLoggedIn = Boolean(localStorage.getItem("token"))


function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  function handleLogout(){
    localStorage.removeItem("token");
    navigate("/login")
  }

  return (
    <nav>
        {
            isLoggedIn && (
                <>
                <Link to="/home">Home</Link>{" | "}

                <Link to="/random">Random Cocktail</Link>{" | "}
                <Link to="/post">Post Cocktail</Link>{" | "}

                 <form onSubmit={handleSearch} style={{ display: "inline" }}>
                 <input
                     type="search"
                    placeholder="Search cocktails..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                 
                  <button 
                    onClick ={() => 
                      navigate(`/search?query=${encodeURIComponent(search)}`)
                    }
                  type="submit">Search</button>
                 
                 
                 </form>

                <span> | </span>
                 <button onClick ={handleLogout}> Logout </button>
                </>
            )
        }
        {
            !isLoggedIn && (
            <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Register</Link>
            </>
        )}
    </nav>
  );
}

export default NavBar;

// Notes =======================================================
// Not logged in → Login | Register
// Logged in     → Home | Random Cocktail | Search |  PostCocktails  | Logout
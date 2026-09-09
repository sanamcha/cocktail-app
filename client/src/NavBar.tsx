import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="top-navbar">
      {isLoggedIn ? (
        <div className="top-navbar__inner">
          <div className="top-navbar__links">
            <Link to="/home">Home</Link>
            <Link to="/random">Random Cocktail</Link>
            <Link to="/post">Post Cocktail</Link>
            <Link to="/favorites">Favorites</Link>
          </div>

          <form onSubmit={handleSearch} className="top-navbar__search">
            <input
              type="search"
              placeholder="Search cocktails..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="submit"
              onClick={() => navigate(`/search?query=${encodeURIComponent(search)}`)}
            >
              Search
            </button>
          </form>

          <button className="top-navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="top-navbar__inner top-navbar__inner--auth">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;

// Notes =======================================================
// Not logged in → Login | Register
// Logged in     → Home | Random Cocktail | Search |  PostCocktails  | Logout
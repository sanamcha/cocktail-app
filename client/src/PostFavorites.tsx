import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Cocktail = {
  id: number;
  name: string;
  category?: string | null;
  alcoholic?: string | null;
  image_url?: string | null;
  ingredients?: unknown[] | null;
  instructions?: string | null;
};

type LikeItem = {
  cocktail_id: number;
};

function PostFavorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Cocktail[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      const token = localStorage.getItem("token");

      try {
        const [likesResponse, cocktailsResponse] = await Promise.all([
          fetch("http://localhost:3000/api/likes", {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
          fetch("http://localhost:3000/api/cocktails", {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
        ]);

        if (!likesResponse.ok || !cocktailsResponse.ok) {
          const likedData = await likesResponse.json().catch(() => ({}));
          const cocktailsData = await cocktailsResponse.json().catch(() => ({}));
          setMessage(
            likedData.message || cocktailsData.message || "Unable to load favorite cocktails"
          );
          return;
        }

        const likedData: LikeItem[] = await likesResponse.json();
        const cocktailsData: Cocktail[] = await cocktailsResponse.json();

        const likedIds = new Set(likedData.map((item) => item.cocktail_id));
        const likedCocktails = cocktailsData.filter((cocktail) => likedIds.has(cocktail.id));

        setFavorites(likedCocktails);
        setMessage("");
      } catch {
        setMessage("Cannot connect to backend");
      }
    }

    void loadFavorites();
  }, []);

  return (
    <main className="post-cocktail-page">
      <div className="post-cocktail-header">
        <h1>Favorite Cocktails</h1>
      </div>

      {message && <p className="post-cocktail-message">{message}</p>}

      {!message && favorites.length === 0 ? (
        <p className="post-cocktail-empty">No liked cocktails yet.</p>
      ) : (
        <div className="cocktail-grid">
          {favorites.map((cocktail) => (
            <article
              key={cocktail.id}
              className="cocktail-card"
              onClick={() => navigate(`/postdetails/${cocktail.id}`)}
              style={{ cursor: "pointer" }}
            >
              {cocktail.image_url ? (
                <img
                  src={cocktail.image_url}
                  alt={cocktail.name}
                  className="cocktail-card__image"
                />
              ) : (
                <div className="cocktail-card__image cocktail-card__image--placeholder">
                  No Image
                </div>
              )}

              <div className="cocktail-card__content">
                <h3>{cocktail.name}</h3>
                {cocktail.category && <p>Category: {cocktail.category}</p>}
                {cocktail.alcoholic && <p>Type: {cocktail.alcoholic}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default PostFavorites;

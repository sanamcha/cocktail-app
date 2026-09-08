import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type IngredientItem =
  | string
  | {
      ingredient?: string | null;
      name?: string | null;
      measure?: string | null;
    };

type PostCocktailDetail = {
  id: number;
  name: string;
  category?: string | null;
  alcoholic?: string | null;
  image_url?: string | null;
  ingredients?: IngredientItem[] | null;
  instructions?: string | null;
};

function normalizeIngredients(items: IngredientItem[] | null | undefined): string[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const ingredient = item.ingredient || item.name || "";
        const measure = item.measure ? `${item.measure} ` : "";
        return `${measure}${ingredient}`.trim();
      }

      return "";
    })
    .filter(Boolean);
}

function PostCocktailDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cocktail, setCocktail] = useState<PostCocktailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCocktail() {
      if (!id) {
        setError("Cocktail not found.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:3000/api/cocktails/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch cocktail details");
        }

        setCocktail(data);
      } catch {
        setError("Unable to load cocktail details.");
      } finally {
        setLoading(false);
      }
    }

    getCocktail();
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h2>Loading cocktail details...</h2>
      </main>
    );
  }

  if (error || !cocktail) {
    return (
      <main style={{ padding: 24 }}>
        <h2>{error || "Cocktail not found."}</h2>
        <button type="button" onClick={() => navigate("/post")}>
          Back to Post page
        </button>
      </main>
    );
  }

  const ingredients = normalizeIngredients(cocktail.ingredients);
  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${cocktail.name} cocktail recipe`
  )}`;

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <button type="button" onClick={() => navigate("/post")}>
          Back to Post page
        </button>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 420px) 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        <div>
          {cocktail.image_url ? (
            <img
              src={cocktail.image_url}
              alt={cocktail.name}
              style={{
                width: "100%",
                borderRadius: 16,
                objectFit: "cover",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                minHeight: 300,
                borderRadius: 16,
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4b5563",
              }}
            >
              No Image
            </div>
          )}
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{cocktail.name}</h1>

          <p>
            <strong>Category:</strong> {cocktail.category || "N/A"}
          </p>
          <p>
            <strong>Type:</strong> {cocktail.alcoholic || "N/A"}
          </p>

          <div style={{ margin: "20px 0" }}>
            <h2>Ingredients</h2>
            <ul>
              {ingredients.length > 0 ? (
                ingredients.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
              ) : (
                <li>No ingredients available.</li>
              )}
            </ul>
          </div>

          <div style={{ margin: "20px 0" }}>
            <h2>How to prepare</h2>
            <p>{cocktail.instructions || "No preparation instructions available."}</p>
          </div>

          <div style={{ marginTop: 20 }}>
            <a
              href={youtubeSearch}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                background: "#ff0000",
                color: "white",
                padding: "10px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PostCocktailDetails;

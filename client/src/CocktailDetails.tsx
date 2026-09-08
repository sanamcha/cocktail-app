import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type CocktailDetail = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  [key: string]: string | undefined;
};

function CocktailDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cocktail, setCocktail] = useState<CocktailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCocktailById() {
      if (!id) {
        setError("Cocktail not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cocktail details");
        }

        const data = await response.json();
        const drink = data.drinks?.[0] ?? null;

        if (!drink) {
          setError("Cocktail not found.");
          return;
        }

        setCocktail(drink);
      } catch {
        setError("Unable to load cocktail details.");
      } finally {
        setLoading(false);
      }
    }

    getCocktailById();
  }, [id]);

  if (loading) {
    return <main style={{ padding: 24 }}><h2>Loading cocktail details...</h2></main>;
  }

  if (error || !cocktail) {
    return (
      <main style={{ padding: 24 }}>
        <h2>{error || "Cocktail not found."}</h2>
        <button onClick={() => navigate("/home")}>Back to Home</button>
      </main>
    );
  }

  const ingredients: string[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
    }
  }

  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${cocktail.strDrink} cocktail recipe`
  )}`;

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("/home")}>Back to Home</button>
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
          <img
            src={cocktail.strDrinkThumb}
            alt={cocktail.strDrink}
            style={{
              width: "100%",
              borderRadius: 16,
              objectFit: "cover",
              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
            }}
          />
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{cocktail.strDrink}</h1>

          <p><strong>Category:</strong> {cocktail.strCategory || "N/A"}</p>
          <p><strong>Type:</strong> {cocktail.strAlcoholic || "N/A"}</p>
          {cocktail.strGlass && <p><strong>Glass:</strong> {cocktail.strGlass}</p>}

          <div style={{ margin: "20px 0" }}>
            <h2>Ingredients</h2>
            <ul>
              {ingredients.length > 0 ? (
                ingredients.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
              ) : (
                <li>No ingredients listed.</li>
              )}
            </ul>
          </div>

          <div style={{ margin: "20px 0" }}>
            <h2>How to prepare</h2>
            <p>{cocktail.strInstructions || "No preparation instructions available."}</p>
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

          <div style={{ marginTop: 20 }}>
            <Link to="/home">Go back to cocktail list</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CocktailDetails;

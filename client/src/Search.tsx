import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query") || "";

  const [cocktails, setCocktails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

 
  
  useEffect(() => {
    async function searchCocktails() {
      if (!query.trim()) {
        setCocktails([]);
        setMessage("Enter a cocktail name to search.");
        return;
      }

      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!data.drinks) {
          setCocktails([]);
          setMessage(`No cocktails found for "${query}".`);
          return;
        }

        setCocktails(data.drinks);
      } catch {
        setMessage("Could not load cocktails from TheCocktailDB.");
      } finally {
        setLoading(false);
      }
    }

    searchCocktails();
  }, [query]);

  return (
    <main className="search-page">
      <div className="search-page__header">
        <h1>Search Results</h1>
        <p>
          Results for: <strong>{query}</strong>
        </p>
      </div>

      {loading && <p className="search-page__status">Loading cocktails...</p>}
      {message && <p className="search-page__status">{message}</p>}

      {!loading && cocktails.length > 0 && (
        <section className="search-results-grid">
          {cocktails.map((cocktail) => (
            <article
              key={cocktail.idDrink}
              className="search-result-card"
              onClick={() => navigate(`/cocktails/${cocktail.idDrink}`)}
              style={{ cursor: "pointer" }}
            >
              {cocktail.strDrinkThumb && (
                <img
                  src={cocktail.strDrinkThumb}
                  alt={cocktail.strDrink}
                  className="search-result-card__image"
                />
              )}

              <div className="search-result-card__content">
                <h2>{cocktail.strDrink}</h2>
                <p>
                  <strong>Category:</strong> {cocktail.strCategory || "N/A"}
                </p>
                <p>
                  <strong>Type:</strong> {cocktail.strAlcoholic || "N/A"}
                </p>
                <p className="search-result-card__instructions">
                  {cocktail.strInstructions || "No instructions available."}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Search;
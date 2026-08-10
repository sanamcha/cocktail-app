import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
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
    <main>
      <h1>Search Results</h1>
      <p>Results for: <strong>{query}</strong></p>

      {loading && <p>Loading cocktails...</p>}
      {message && <p>{message}</p>}

      {cocktails.map((cocktail) => (
        <article key={cocktail.idDrink}>
          <h2>{cocktail.strDrink}</h2>
          <p>Category: {cocktail.strCategory}</p>
          <p>Type: {cocktail.strAlcoholic}</p>
          <p>{cocktail.strInstructions}</p>

          {cocktail.strDrinkThumb && (
            <img
              src={cocktail.strDrinkThumb}
              alt={cocktail.strDrink}
              width="200"
            />
          )}
        </article>
      ))}
    </main>
  );
}

export default Search;
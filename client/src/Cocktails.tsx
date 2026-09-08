import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Cocktail = {
  id: number | string;
  name: string;
  category: string;
  alcoholic: string;
  image_url?: string;
};

type ApiDrink = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
};

function Cocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getCocktails() {
      try {
        const response = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cocktails");
        }

        const data = await response.json();
        const drinks: ApiDrink[] = Array.isArray(data.drinks) ? data.drinks : [];

        const mappedCocktails: Cocktail[] = drinks.slice(0, 20).map((drink) => ({
          id: drink.idDrink,
          name: drink.strDrink,
          category: "Cocktail",
          alcoholic: "Mixed",
          image_url: drink.strDrinkThumb,
        }));

        setCocktails(mappedCocktails);
      } catch {
        setMessage("Cannot connect to CocktailDB");
      }
    }

    getCocktails();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <main className="cocktail-page">
      <div className="cocktail-page__header">
        <h1>Cocktail List</h1>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>

      {message && <p>{message}</p>}

      <section className="cocktail-grid">
        {cocktails.map((cocktail) => (
          <article
            key={cocktail.id}
            className="cocktail-card"
            onClick={() => navigate(`/cocktails/${cocktail.id}`)}
            style={{ cursor: "pointer" }}
          >
            {cocktail.image_url && (
              <img
                src={cocktail.image_url}
                alt={cocktail.name}
                className="cocktail-card__image"
              />
            )}
            <div className="cocktail-card__content">
              <h2>{cocktail.name}</h2>
              <p>Category: {cocktail.category}</p>
              <p>Type: {cocktail.alcoholic}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Cocktails;

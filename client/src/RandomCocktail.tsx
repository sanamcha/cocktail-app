import { useEffect, useState } from "react";

type Cocktail = {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strAlcoholic: string;
  strInstructions: string;
  strDrinkThumb: string;
};

function RandomCocktail() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getRandomCocktail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/random.php"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cocktail.");
      }

      const data = await response.json();

      if (data.drinks && data.drinks.length > 0) {
        setCocktail(data.drinks[0]);
      } else {
        setError("No cocktail found.");
      }
    } catch (err) {
      setError("Unable to load random cocktail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRandomCocktail();
  }, []);

  if (loading)
    return <h2 className="random-cocktail-status">Loading random cocktail...</h2>;

  if (error) return <h2 className="random-cocktail-status">{error}</h2>;

  return (
    <main className="random-cocktail-page">
      <div className="random-cocktail-card">
        <h1>🍸 Random Cocktail</h1>

        {cocktail && (
          <article className="random-cocktail-content">
            <div className="random-cocktail-image-wrap">
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="random-cocktail-image"
              />
            </div>

            <div className="random-cocktail-details">
              <h2>{cocktail.strDrink}</h2>

              <p>
                <strong>Category:</strong> {cocktail.strCategory}
              </p>

              <p>
                <strong>Type:</strong> {cocktail.strAlcoholic}
              </p>

              <div className="random-cocktail-instructions">
                <strong>Instructions:</strong>
                <p>{cocktail.strInstructions}</p>
              </div>
            </div>
          </article>
        )}

        <button className="random-cocktail-button" onClick={getRandomCocktail}>
          Get Another Random Cocktail
        </button>
      </div>
    </main>
  );
}

export default RandomCocktail;



//================================================================
// Below is code to get random cocktails from local database

// import { useEffect, useState } from "react";

// function RandomCocktail() {
//   const [cocktail, setCocktail] = useState<any>(null);
//   const [message, setMessage] = useState("");

//   async function getRandomCocktail() {
//     const token = localStorage.getItem("token");

//     const response = await fetch("http://localhost:3000/api/cocktails", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       setMessage(data.message || "Cannot load cocktails");
//       return;
//     }

//     const randomIndex = Math.floor(Math.random() * data.length);
//     setCocktail(data[randomIndex]);
//   }

//   useEffect(() => {
//     getRandomCocktail();
//   }, []);

//   if (message) return <p>{message}</p>;

//   return (
//     <main>
//       <h1>Random Cocktail</h1>

//       <button onClick={getRandomCocktail}>Show Another</button>

//       {cocktail && (
//         <article>
//           <h2>{cocktail.name}</h2>
//           <p>{cocktail.category}</p>
//           <p>{cocktail.instructions}</p>

//           {cocktail.image_url && (
//             <img src={cocktail.image_url} alt={cocktail.name} width="250" />
//           )}
//         </article>
//       )}
//     </main>
//   );
// }

// export default RandomCocktail;
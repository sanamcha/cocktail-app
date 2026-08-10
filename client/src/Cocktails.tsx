import { useEffect, useState } from "react";

type Cocktail = {
  id: number;
  name: string;
  category: string | null;
  alcoholic: string | null;
  image_url?: string | null;
};

function Cocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getCocktails() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/cocktails", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Cannot load cocktails");
          return;
        }

        setCocktails(data);
      } catch {
        setMessage("Cannot connect to backend");
      }
    }

    getCocktails();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <main>
      <h1>Cocktail List</h1>
      <button onClick={logout}>Logout</button>

      {message && <p>{message}</p>}

      {cocktails.map((cocktail) => (
        <article key={cocktail.id}>
          <h2>{cocktail.name}</h2>
          <p>Category: {cocktail.category}</p>
          <p>Type: {cocktail.alcoholic}</p>
          {cocktail.image_url && (
            <img src={cocktail.image_url} alt={cocktail.name} width="150" />
          )}
        </article>
      ))}
    </main>
  );
}

export default Cocktails;

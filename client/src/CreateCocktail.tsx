import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCocktail() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [alcoholic, setAlcoholic] = useState("Alcoholic");
  const [glass, setGlass] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Login first to post a cocktail.");
      return;
    }

    if (!name.trim()) {
      setMessage("Cocktail name is required.");
      return;
    }

    setLoading(true);

    const ingredientList = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await fetch("http://localhost:3000/api/cocktails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim() || null,
          alcoholic: alcoholic || null,
          glass: glass.trim() || null,
          instructions: instructions.trim() || null,
          image_url: imageUrl.trim() || null,
          ingredients: ingredientList,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not post cocktail.");
        return;
      }

      navigate("/home");
    } catch {
      setMessage("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Post a New Cocktail</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. Cocktail, Ordinary Drink"
          />
        </label>

        <label>
          Type
          <select
            value={alcoholic}
            onChange={(event) => setAlcoholic(event.target.value)}
          >
            <option value="Alcoholic">Alcoholic</option>
            <option value="Non alcoholic">Non alcoholic</option>
            <option value="Optional alcohol">Optional alcohol</option>
          </select>
        </label>

        <label>
          Glass
          <input
            type="text"
            value={glass}
            onChange={(event) => setGlass(event.target.value)}
            placeholder="e.g. Highball glass"
          />
        </label>

        <label>
          Instructions
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Mix ingredients, shake/stir, and serve"
          />
        </label>

        <label>
          Image URL
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          Ingredients (comma separated)
          <input
            type="text"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            placeholder="Gin, Lemon juice, Sugar, Soda water"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Cocktail"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </main>
  );
}

export default CreateCocktail;

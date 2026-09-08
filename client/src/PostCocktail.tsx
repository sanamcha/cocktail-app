import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type IngredientItem =
  | string
  | {
      ingredient?: string | null;
      name?: string | null;
      measure?: string | null;
    };

type Cocktail = {
  id: number;
  name: string;
  category?: string | null;
  alcoholic?: string | null;
  image_url?: string | null;
  ingredients?: IngredientItem[] | null;
  instructions?: string | null;
};

type EditForm = {
  name: string;
  category: string;
  alcoholic: string;
  image_url: string;
  ingredients: string;
  instructions: string;
};

function normalizeIngredients(items: IngredientItem[] | null | undefined): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

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

function PostCocktail() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [alcoholic, setAlcoholic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [likedCocktailIds, setLikedCocktailIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    category: "",
    alcoholic: "",
    image_url: "",
    ingredients: "",
    instructions: "",
  });
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

    async function getLikedCocktails() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/likes", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setLikedCocktailIds(data.map((like: { cocktail_id: number }) => like.cocktail_id));
      } catch {
        // ignore missing likes data
      }
    }

    getCocktails();
    getLikedCocktails();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/cocktails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name,
          category,
          alcoholic,
          image_url: imageUrl,
          ingredients: ingredients
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          instructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to post cocktail");
        return;
      }

      setCocktails((current) => [...current, data]);
      setName("");
      setCategory("");
      setAlcoholic("");
      setImageUrl("");
      setIngredients("");
      setInstructions("");
      setMessage("Cocktail posted successfully");
    } catch {
      setMessage("Cannot connect to backend");
    }
  }

  async function handleDelete(cocktailId: number) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/cocktails/${cocktailId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Failed to delete cocktail");
        return;
      }

      setCocktails((current) => current.filter((cocktail) => cocktail.id !== cocktailId));
      setLikedCocktailIds((current) => current.filter((id) => id !== cocktailId));
      setMessage("Cocktail deleted successfully");
    } catch {
      setMessage("Cannot connect to backend");
    }
  }

  async function toggleLike(cocktailId: number) {
    const token = localStorage.getItem("token");

    const isLiked = likedCocktailIds.includes(cocktailId);

    try {
      const response = await fetch(`http://localhost:3000/api/likes/${cocktailId}`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "Unable to update like");
        return;
      }

      setLikedCocktailIds((current) =>
        isLiked ? current.filter((id) => id !== cocktailId) : [...current, cocktailId]
      );

      setMessage(isLiked ? "Like removed" : "Cocktail liked");
    } catch {
      setMessage("Cannot connect to backend");
    }
  }

  function startEdit(cocktail: Cocktail) {
    setEditingId(cocktail.id);
    setEditForm({
      name: cocktail.name || "",
      category: cocktail.category || "",
      alcoholic: cocktail.alcoholic || "",
      image_url: cocktail.image_url || "",
      ingredients: normalizeIngredients(cocktail.ingredients).join("\n"),
      instructions: cocktail.instructions || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      name: "",
      category: "",
      alcoholic: "",
      image_url: "",
      ingredients: "",
      instructions: "",
    });
  }

  async function saveEdit(cocktailId: number) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/cocktails/${cocktailId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: editForm.name,
          category: editForm.category,
          alcoholic: editForm.alcoholic,
          image_url: editForm.image_url,
          ingredients: editForm.ingredients
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          instructions: editForm.instructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update cocktail");
        return;
      }

      setCocktails((current) =>
        current.map((cocktail) =>
          cocktail.id === cocktailId ? { ...cocktail, ...data } : cocktail
        )
      );

      setEditingId(null);
      setEditForm({
        name: "",
        category: "",
        alcoholic: "",
        image_url: "",
        ingredients: "",
        instructions: "",
      });
      setMessage("Cocktail updated successfully");
    } catch {
      setMessage("Cannot connect to backend");
    }
  }

  return (
    <main>
      <h1>Post a Cocktail</h1>

      {message && <p>{message}</p>}

      <div className="post-cocktail-layout">
        <form onSubmit={handleSubmit} className="post-cocktail-form">
          <div>
            <label>
              Name: <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Category:{" "}
              <input value={category} onChange={(e) => setCategory(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Type (alcoholic / non-alcoholic):{" "}
              <input value={alcoholic} onChange={(e) => setAlcoholic(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Image URL: <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Ingredients (one per line):
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={5}
              />
            </label>
          </div>
          <div>
            <label>
              How to prepare:
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={5}
              />
            </label>
          </div>
          <div>
            <button type="submit">Post Cocktail</button>
          </div>
        </form>

        <section className="post-cocktail-list">
          <h2>All Cocktails</h2>

          {cocktails.length === 0 ? (
            <p>No cocktails yet.</p>
          ) : (
            <div className="cocktail-grid">
              {cocktails.map((cocktail) => {
                const isEditing = editingId === cocktail.id;

                return (
                  <article
                    key={cocktail.id}
                    className="cocktail-card"
                    onClick={() => {
                      if (!isEditing) {
                        navigate(`/postdetails/${cocktail.id}`);
                      }
                    }}
                    style={{ cursor: isEditing ? "default" : "pointer" }}
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
                      {isEditing ? (
                        <>
                          <input
                            value={editForm.name}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditForm((current) => ({ ...current, name: e.target.value }));
                            }}
                            placeholder="Name"
                          />
                          <input
                            value={editForm.category}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditForm((current) => ({ ...current, category: e.target.value }));
                            }}
                            placeholder="Category"
                          />
                          <input
                            value={editForm.alcoholic}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditForm((current) => ({ ...current, alcoholic: e.target.value }));
                            }}
                            placeholder="Type"
                          />
                          <input
                            value={editForm.image_url}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditForm((current) => ({ ...current, image_url: e.target.value }));
                            }}
                            placeholder="Image URL"
                          />
                          <textarea
                            value={editForm.ingredients}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditForm((current) => ({ ...current, ingredients: e.target.value }));
                            }}
                            placeholder="Ingredients (one per line)"
                            rows={4}
                          />
                          <textarea
                            value={editForm.instructions}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setEditForm((current) => ({ ...current, instructions: e.target.value }));
                            }}
                            placeholder="How to prepare"
                            rows={4}
                          />

                          <div className="card-actions">
                            <button
                              type="button"
                              className="save-cocktail-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                saveEdit(cocktail.id);
                              }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="cancel-cocktail-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                cancelEdit();
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3>{cocktail.name}</h3>
                          {cocktail.category && <p>Category: {cocktail.category}</p>}
                          {cocktail.alcoholic && <p>Type: {cocktail.alcoholic}</p>}

                          <div className="card-footer-actions">
                            <button
                              type="button"
                              className="delete-cocktail-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(cocktail.id);
                              }}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              className="edit-cocktail-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                startEdit(cocktail);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleLike(cocktail.id);
                              }}
                              aria-label={likedCocktailIds.includes(cocktail.id) ? "Unlike cocktail" : "Like cocktail"}
                              title={likedCocktailIds.includes(cocktail.id) ? "Unlike" : "Like"}
                              style={{
                                color: likedCocktailIds.includes(cocktail.id) ? "#0d6efd" : "#6c757d",
                                fontSize: "1.5rem",
                                lineHeight: 1,
                              }}
                            >
                              <i
                                className={`bi ${
                                  likedCocktailIds.includes(cocktail.id)
                                    ? "bi-hand-thumbs-up-fill"
                                    : "bi-hand-thumbs-up"
                                }`}
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PostCocktail;

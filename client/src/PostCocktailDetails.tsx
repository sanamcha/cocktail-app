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

type Review = {
  id: string;
  rating?: number;
  comment: string | null;
  user_name: string;
  created_at: string;
};

type ReviewDraft = {
  comment: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft>({
    comment: "",
  });

  useEffect(() => {
    async function getCocktail() {
      if (!id) {
        setError("Cocktail not found.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const cocktailResponse = await fetch(`http://localhost:3000/api/cocktails/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const cocktailData = await cocktailResponse.json();

        if (!cocktailResponse.ok) {
          throw new Error(cocktailData.message || "Failed to fetch cocktail details");
        }

        setCocktail(cocktailData);

        const reviewsResponse = await fetch(`http://localhost:3000/api/reviews/cocktail/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const reviewsData = await reviewsResponse.json();

        if (reviewsResponse.ok) {
          setReviews(reviewsData);
        }
      } catch {
        setError("Unable to load cocktail details.");
      } finally {
        setLoading(false);
      }
    }

    getCocktail();
  }, [id]);

  async function handleAddReview(event: React.FormEvent) {
    event.preventDefault();

    if (!id) {
      setReviewError("Cocktail not found.");
      return;
    }

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setReviewError("Please enter a comment before submitting.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/cocktail/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          rating: 5,
          comment: trimmedComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save review");
      }

      setReviews((current) => [
        {
          id: data.id,
          rating: data.rating ?? 5,
          comment: data.comment,
          user_name: "You",
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
      setComment("");
      setReviewError("");
      setReviewMessage("Comment added successfully.");
    } catch (error) {
      setReviewMessage("");
      setReviewError(error instanceof Error ? error.message : "Unable to save comment.");
    }
  }

  function startReviewEdit(review: Review) {
    setEditingReviewId(review.id);
    setReviewDraft({
      comment: review.comment || "",
    });
  }

  async function saveReviewEdit(reviewId: string) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          rating: 5,
          comment: reviewDraft.comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review");
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                rating: data.rating ?? 5,
                comment: data.comment,
              }
            : review
        )
      );
      setEditingReviewId(null);
      setReviewDraft({ comment: "" });
      setReviewError("");
      setReviewMessage("Comment updated successfully.");
    } catch (error) {
      setReviewMessage("");
      setReviewError(error instanceof Error ? error.message : "Unable to update comment.");
    }
  }

  async function deleteReview(reviewId: string) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      setReviews((current) => current.filter((review) => review.id !== reviewId));
      setReviewError("");
      setReviewMessage("Comment deleted successfully.");
    } catch (error) {
      setReviewMessage("");
      setReviewError(error instanceof Error ? error.message : "Unable to delete comment.");
    }
  }

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

      <section style={{ marginTop: 30, maxWidth: 700 }}>
        <h2>Comments</h2>

        <form
          onSubmit={handleAddReview}
          style={{
            display: "grid",
            gap: 12,
            background: "#e5e7eb",
            border: "1px solid #d1d5db",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
          }}
        >
          <label style={{ display: "grid", gap: 8, color: "#111827", fontWeight: 700 }}>
            Comment
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              placeholder="Write your review..."
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                background: "#f3f4f6",
                color: "#111827",
                fontSize: 15,
                lineHeight: 1.5,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              width: "fit-content",
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Add Comment
          </button>
        </form>

        {reviewError && <p style={{ color: "#b91c1c", marginTop: 12 }}>{reviewError}</p>}
        {reviewMessage && <p style={{ color: "#166534", marginTop: 12 }}>{reviewMessage}</p>}

        <div style={{ marginTop: 20 }}>
          {reviews.length === 0 ? (
            <p>No comments yet for this cocktail.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
              {reviews.map((review) => {
                const isEditing = editingReviewId === review.id;

                return (
                  <li
                    key={review.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: 12,
                      background: "#f9fafb",
                    }}
                  >
                    {isEditing ? (
                      <div style={{ display: "grid", gap: 12 }}>
                        <label style={{ display: "grid", gap: 8, color: "#111827", fontWeight: 700 }}>
                          Comment
                          <textarea
                            value={reviewDraft.comment}
                            onChange={(event) =>
                              setReviewDraft((current) => ({
                                ...current,
                                comment: event.target.value,
                              }))
                            }
                            rows={3}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid #cbd5e1",
                              background: "#f3f4f6",
                              color: "#111827",
                              fontSize: 15,
                              lineHeight: 1.5,
                              resize: "vertical",
                              boxSizing: "border-box",
                            }}
                          />
                        </label>

                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => saveReviewEdit(review.id)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "none",
                              background: "#0f172a",
                              color: "#ffffff",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReviewId(null);
                              setReviewDraft({ comment: "" });
                            }}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid #d1d5db",
                              background: "#ffffff",
                              color: "#111827",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ color: "#111827" }}>{review.user_name}</strong>
                        </div>

                        <p style={{ margin: "8px 0 0", color: "#374151", lineHeight: 1.6 }}>
                          {review.comment || "No comment provided."}
                        </p>

                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                          <button
                            type="button"
                            onClick={() => startReviewEdit(review)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "2px solid #facc15",
                              background: "#fffbea",
                              color: "#111827",
                              cursor: "pointer",
                              fontWeight: 700,
                              boxShadow: "inset 0 0 0 1px rgba(250, 204, 21, 0.25)",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteReview(review.id)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid #ef4444",
                              background: "#fee2e2",
                              color: "#991b1b",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export default PostCocktailDetails;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cocktails
CREATE TABLE cocktails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cocktaildb_id TEXT UNIQUE,          
  name TEXT NOT NULL,
  category TEXT,
  alcoholic TEXT,
  glass TEXT,
  instructions TEXT,
  image_url TEXT,
  ingredients JSONB,                  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A user saves a cocktail as a favorite
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cocktail_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_favorite_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_favorite_cocktail
    FOREIGN KEY (cocktail_id) REFERENCES cocktails(id) ON DELETE CASCADE,

  -- A user can favorite a cocktail only once
  CONSTRAINT unique_user_favorite
    UNIQUE (user_id, cocktail_id)
);

-- A user writes a review for a cocktail
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cocktail_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_review_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_review_cocktail
    FOREIGN KEY (cocktail_id) REFERENCES cocktails(id) ON DELETE CASCADE,

  -- One review per user for each cocktail
  CONSTRAINT unique_user_review
    UNIQUE (user_id, cocktail_id)
);


-- Relationships:

-- users.id      → favorites.user_id
-- cocktails.id  → favorites.cocktail_id

-- users.id      → reviews.user_id
-- cocktails.id  → reviews.cocktail_id
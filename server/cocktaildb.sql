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

-- A user writes a comment for a cocktail
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cocktail_id UUID NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_comment_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_comment_cocktail
    FOREIGN KEY (cocktail_id) REFERENCES cocktails(id) ON DELETE CASCADE,

  -- One comment per user for each cocktail
  CONSTRAINT unique_user_comment
    UNIQUE (user_id, cocktail_id)
);

-- A user can like a cocktail only once
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cocktail_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_like_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_like_cocktail
    FOREIGN KEY (cocktail_id) REFERENCES cocktails(id) ON DELETE CASCADE,

  CONSTRAINT unique_user_like
    UNIQUE (user_id, cocktail_id)
);


-- Relationships:

-- users.id      → favorites.user_id
-- cocktails.id  → favorites.cocktail_id

-- users.id      → comments.user_id
-- cocktails.id  → comments.cocktail_id

-- users.id      → likes.user_id
-- cocktails.id  → likes.cocktail_id
client/server run: npm run dev
 Local:   http://localhost:5173/


# React + TypeScript + Vite

cocktail-app/
├── client/   # React frontend
└── server/   # Node.js backend

================================================================

===============================================================

1. Choose the stack
Frontend: React + TypeScript + Vite
Backend: Node.js + Express + TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: JWT in secure HTTP-only cookies
Validation: Zod
Local setup: Docker Compose
Deployment: containerized frontend/backend plus managed PostgreSQL
2. Define the MVP
Build these features first:
Search cocktails by name.
View a cocktail’s ingredients and instructions.
Find a random cocktail.
Filter by ingredient, category, alcoholic/non-alcoholic, or glass.
Register and log in.
Save favorite cocktails.
Add a personal rating and note.
Do not copy the full external cocktail database into PostgreSQL initially. Call it through your backend and store only its idDrink as cocktailId.
3. Create the project
mkdir cocktail-app
cd cocktail-app

npm create vite@latest client -- --template react-ts
mkdir server
cd server
npm init -y
Recommended structure:


cocktail-app/
├── client/                     # React application
│   └── src/
│       ├── components/
            ├──Cocktails
            ├──RandomCocktail
            ├──Navbar
            ├──PostCocktail
            ├──EditCocktail
            ├──
            ├──

│       ├── pages/
│       ├── services/
│       └── types/

├── server/                     # Node / Express API
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       ├── lib/
│       └── app.ts
├── prisma/
│   └── schema.prisma
├── compose.yaml
└── README.md


4. Design the database
The API already owns cocktail recipes. Your database stores each user’s relationship with a cocktail.
```mermaid
erDiagram
  USER ||--o{ FAVORITE : saves
  USER ||--o{ REVIEW : writes

  USER {
    uuid id PK
    string name
    string email UK
    string passwordHash
    datetime createdAt
  }

  FAVORITE {
    uuid id PK
    uuid userId FK
    string cocktailId
    datetime createdAt
  }

  REVIEW {
    uuid id PK
    uuid userId FK
    string cocktailId
    int rating
    string note
    datetime createdAt
    datetime updatedAt
  }
```



Example Prisma schema:
model User {
  id           String     @id @default(uuid())
  name         String
  email        String     @unique
  passwordHash String
  favorites    Favorite[]
  reviews      Review[]
  createdAt    DateTime   @default(now())
}

model Favorite {
  id         String   @id @default(uuid())
  userId     String
  cocktailId String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())

  @@unique([userId, cocktailId])
}

model Review {
  id         String   @id @default(uuid())
  userId     String
  cocktailId String
  rating     Int
  note       String?
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([userId, cocktailId])
}
5. Create backend endpoints
Your React app should call your Node API, not TheCocktailDB directly. This protects a production API key, lets you validate requests, cache results, and keep API logic in one place.
GET    /api/cocktails/search?name=margarita
GET    /api/cocktails/:id
GET    /api/cocktails/random
GET    /api/cocktails/filter?ingredient=gin
GET    /api/filters/categories

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/favorites
POST   /api/favorites/:cocktailId
DELETE /api/favorites/:cocktailId

POST   /api/reviews/:cocktailId
GET    /api/reviews/:cocktailId
Example external call inside the Node service:
const BASE_URL = "https://www.thecocktaildb.com/api/json/v1";
const API_KEY = process.env.COCKTAIL_DB_KEY!;

export async function searchCocktails(name: string) {
  const response = await fetch(
    `${BASE_URL}/${API_KEY}/search.php?s=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error("Cocktail service is unavailable");
  }

  return response.json();
}
The useful external endpoints include:
/search.php?s=margarita    Search by name
/lookup.php?i=11007        Full cocktail details
/random.php                Random drink
/filter.php?i=Gin          Filter by ingredient
/list.php?c=list           List categories
TheCocktailDB documents these endpoints and available filters.
6. Build the React pages
Start with five pages:
/                 Home: search and random cocktail
/cocktails/:id    Cocktail details
/favorites        Logged-in user favorites
/login            Sign in
/register         Create account
Useful components:
SearchBar
CocktailCard
CocktailGrid
CocktailDetails
IngredientList
FavoriteButton
RatingForm
Navbar
Data flow:
User types “Margarita”
→ React calls GET /api/cocktails/search?name=Margarita
→ Node calls TheCocktailDB
→ Node returns cleaned JSON
→ React renders CocktailCard components
7. Secure and improve it
Add these before deployment:
Validate all inputs with Zod.
Hash passwords with bcrypt.
Store JWT tokens in httpOnly, secure, sameSite cookies—not local storage.
Use environment variables for database URLs and API keys.
Add request rate limiting to your Node API.
Add a short cache for popular cocktail queries.
Add error/loading/empty states in React.
Never commit .env files.
Example environment file:
DATABASE_URL=postgresql://cocktail_user:password@localhost:5432/cocktails
COCKTAIL_DB_KEY=1
JWT_SECRET=replace-with-a-long-random-value
CLIENT_URL=http://localhost:5173
8. Run PostgreSQL locally with Docker
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: cocktails
      POSTGRES_USER: cocktail_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
Run it:
docker compose up -d
npx prisma migrate dev --name init
9. Build order
Set up React and Express.
Create GET /search, /random, and /:id.
Build the search and details pages.
Add PostgreSQL and Prisma.
Add registration/login.
Add favorites.
Add ratings and notes.
Add tests.
Dockerize and deploy.
10. Deploy
Use separate services:
React static site       → Vercel, Netlify, or Cloudflare Pages
Node API container      → Render, Railway, Fly.io, or Google Cloud Run
PostgreSQL              → Neon, Supabase, Render, or Railway
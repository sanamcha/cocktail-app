server run: npm start



<!-- basic structure -->

server/
├── server.js
├── db.js
├── middleware/
│   └── auth.js
└── routes/
    ├── auth.js
    └── cocktails.js
    └── users.js
    └── reviews.js
    └── favorites.js


--------------------------------------

ROUTES:

POST   /api/auth/register
POST   /api/auth/login

GET    /api/cocktails
GET    /api/cocktails/:id
POST   /api/cocktails
PUT    /api/cocktails/:id
DELETE /api/cocktails/:id


GET    /api/users/me
PUT    /api/users/me

GET    /api/favorites
POST   /api/favorites/:cocktailId
DELETE /api/favorites/:cocktailId

GET    /api/reviews/cocktail/:cocktailId
POST   /api/reviews/cocktail/:cocktailId
PUT    /api/reviews/:reviewId
DELETE /api/reviews/:reviewId
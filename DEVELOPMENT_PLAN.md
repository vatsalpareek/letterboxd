# Melodex — Backend Development Plan

> A Letterboxd-style platform for music (songs & albums).
> This is a learning project. Prioritize clean code, real-world practices, and understanding over speed.

---

## Phase 1: Project Setup (COMPLETED)
**Goal:** Get Express running with a clean folder structure and basic middleware.

### 1.1 Folder Structure
```
letterboxd/
├── src/
│   ├── config/          # DB connection, env setup
│   ├── controllers/     # Business logic (what happens when a route is hit)
│   ├── middleware/      # Auth guards, error handlers
│   ├── models/          # SQL query functions (or ORM models)
│   ├── routes/          # Route definitions (URL → controller)
│   └── app.js           # Express app setup
├── .env                 # Secret keys (never commit this)
├── .gitignore
├── package.json
└── server.js            # Entry point — starts the server
```

### 1.2 Steps
- [x] `npm init` and install: `express`, `dotenv`, `cors`, `pg`, `bcrypt`, `jsonwebtoken`
- [x] Set up `server.js` (starts server on a port)
- [x] Set up `src/app.js` (registers middleware and routes)
- [x] Add `.env` with `PORT`, `DATABASE_URL`, `JWT_SECRET`
- [x] Add `.gitignore` (include `node_modules`, `.env`)
- [x] Test that `GET /` returns `{ message: "Server is running" }`

---

## Phase 2: Database Design (COMPLETED)
**Goal:** Design a clean PostgreSQL schema that can grow.

### Tables

#### `users`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| username | VARCHAR(50) UNIQUE NOT NULL | |
| email | VARCHAR(255) UNIQUE NOT NULL | |
| password_hash | TEXT NOT NULL | bcrypt hash |
| bio | TEXT | Optional |
| created_at | TIMESTAMP | DEFAULT NOW() |

#### `songs` *(cached from Spotify)*
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| spotify_id | VARCHAR(100) UNIQUE NOT NULL | |
| title | VARCHAR(255) NOT NULL | |
| artist | VARCHAR(255) NOT NULL | |
| album_name | VARCHAR(255) | |
| cover_url | TEXT | |
| duration_ms | INT | |
| cached_at | TIMESTAMP | DEFAULT NOW() |

#### `albums` *(cached from Spotify)*
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| spotify_id | VARCHAR(100) UNIQUE NOT NULL | |
| title | VARCHAR(255) NOT NULL | |
| artist | VARCHAR(255) NOT NULL | |
| cover_url | TEXT | |
| release_date | DATE | |
| cached_at | TIMESTAMP | DEFAULT NOW() |

#### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| user_id | INT REFERENCES users(id) | FK |
| song_id | INT REFERENCES songs(id) | FK (nullable) |
| album_id | INT REFERENCES albums(id) | FK (nullable) |
| rating | NUMERIC(3,1) | e.g. 4.5 out of 5 |
| body | TEXT | The actual review text |
| created_at | TIMESTAMP | DEFAULT NOW() |

#### `lists`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| user_id | INT REFERENCES users(id) | FK |
| title | VARCHAR(255) NOT NULL | |
| description | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |

#### `list_items`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PRIMARY KEY | |
| list_id | INT REFERENCES lists(id) | FK |
| song_id | INT REFERENCES songs(id) | FK |
| position | INT | Order within the list |

### Relationships
- **One-to-many:** One user → many reviews, many lists
- **Many-to-many:** Lists ↔ Songs (through `list_items`)
- A review belongs to either a song OR an album (not enforced at DB level, but at app level)

### Steps
- [x] Install and connect to PostgreSQL locally
- [x] Create a database: `melodex_db`
- [x] Write and run `schema.sql` to create all tables
- [x] Test connections with `psql`

---

## Phase 3: Authentication System (COMPLETED)
**Goal:** Let users sign up and log in. Protect routes that require auth.

### Endpoints
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Get JWT token

### How It Works
1. **Signup:** Validate input → hash password with `bcrypt` → insert into `users` → return success
2. **Login:** Find user by email → compare password with `bcrypt.compare()` → issue a JWT token
3. **Protected routes:** Middleware checks if the `Authorization: Bearer <token>` header is valid

### JWT Flow
```
Client → POST /login → Server validates → Server signs JWT → Client stores token
Client → GET /profile (with Bearer token) → Middleware verifies → Controller runs
```

### Steps
- [x] Write `authController.js` (signup + login logic)
- [x] Write `authRoutes.js` (wire routes to controller)
- [x] Write `authMiddleware.js` (verify JWT on protected routes)
- [x] Test with a tool like Postman or Thunder Client

---

## Phase 4: Song & Album Handling (Spotify API)
**Goal:** Let users search for songs/albums via Spotify. Cache results locally.

### Why Cache?
- Spotify API has rate limits
- Faster response times
- You can attach local data (ratings, reviews) to a local ID

### Strategy: Search → Cache → Return
1. User searches for "Blinding Lights"
2. Your server calls **Spotify Search API**
3. Results come back — you check if `spotify_id` already exists in your `songs` table
4. If not, insert it (caching). If yes, just return existing row.
5. Return song data to client

### Endpoints
- `GET /api/songs/search?q=blinding+lights` — Search via Spotify, cache results
- `GET /api/songs/:spotifyId` — Get cached song details

### Spotify Auth
Spotify uses **Client Credentials Flow** for public data (no user login needed):
- Register app at [developer.spotify.com](https://developer.spotify.com)
- Get `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Exchange for an access token → use it in API calls

### Steps
- [ ] Register Spotify app, get credentials
- [ ] Write a `spotifyService.js` to handle token fetch + search
- [ ] Write `songsController.js` and `songsRoutes.js`
- [ ] Test search endpoint

---

## Phase 5: Reviews & Ratings
**Goal:** Let auth'd users write/edit/delete reviews and rate songs.

### Endpoints
- `POST /api/reviews` — Add a review (protected)
- `PUT /api/reviews/:id` — Edit a review (protected, must be owner)
- `DELETE /api/reviews/:id` — Delete a review (protected, must be owner)
- `GET /api/reviews/song/:spotifyId` — Get all reviews for a song
- `GET /api/reviews/song/:spotifyId/rating` — Get average rating

### Business Logic
- A user can only have **one review per song** (enforce with a unique constraint or app-level check)
- Average rating: `SELECT AVG(rating) FROM reviews WHERE song_id = $1`
- Only the review owner can edit or delete it

### Steps
- [ ] Write `reviewsController.js`
- [ ] Write `reviewsRoutes.js` (apply auth middleware to write routes)
- [ ] Test CRUD operations via Postman

---

## Phase 6: Lists / Playlists
**Goal:** Let users create curated lists of songs (like "My Top 50").

### Endpoints
- `POST /api/lists` — Create a list (protected)
- `GET /api/lists/:id` — Get a list and its songs
- `POST /api/lists/:id/songs` — Add a song to a list (protected)
- `DELETE /api/lists/:id/songs/:songId` — Remove a song from a list (protected)
- `GET /api/users/:userId/lists` — Get all lists by a user

### Steps
- [ ] Write `listsController.js` and `listsRoutes.js`
- [ ] Handle `list_items` inserts/deletes
- [ ] Return list with songs (JOIN query)

---

## Phase 7: User Profile
**Goal:** A basic profile endpoint showing user activity.

### Endpoints
- `GET /api/users/:userId` — Public profile (username, bio, review count)
- `GET /api/users/:userId/reviews` — All reviews by user
- `GET /api/users/:userId/lists` — All lists by user
- `GET /api/users/me` — Authenticated user's own profile (protected)

### Steps
- [ ] Write `usersController.js` and `usersRoutes.js`
- [ ] Aggregate review + list data per user
- [ ] Protect `/me` route, make others public

---

## Future Phases (Not Now)
- Following system / activity feed
- Notifications
- Frontend (React)
- Deployment (Railway, Render, etc.)

---

## Current Status
> **Phase:** Phase 4 — Song & Album Handling
> **Next step:** Learn about Spotify API Client Credentials flow

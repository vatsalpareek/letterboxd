# Melodex — Frontend Development Plan
> The "Face" of the Industrial Music Archive.

---

## Phase 1: Foundation & Brutalist Branding (COMPLETED)
**Goal:** Establish the raw industrial aesthetic and core layout.
- [x] Initialize React + Vite project
- [x] Configure "The Concrete Grid" (Layout, Sidebar, Navbar)
- [x] Define Brutalist Design System (Stark Borders, Hard Shadows, Space Grotesk Font)
- [x] Build placeholder components for Feed, Search, and Music Cards

---

## Phase 2: Authentication Bridge
**Goal:** Let users login/signup and store their "Passport" (JWT Token).
- [ ] Create Login & Signup pages (Stark input fields)
- [ ] Implement `AuthContext` to store the token in `localStorage`
- [ ] Connect frontend forms to `POST /api/auth/login` & `POST /api/auth/signup`
- [ ] Redirect users to the dashboard after a successful login

---

## Phase 3: Live Music Search
**Goal:** Connect the search bar to the iTunes API via the backend.
- [ ] Fetch current search results from `GET /api/songs/search?q=...`
- [ ] Map backend results into the "Brutalist Cards"
- [ ] Show a "Log Review" button on each card

---

## Phase 4: Reviews & Rankings
**Goal:** Allow users to write and view song reviews from the UI.
- [ ] Use `POST /api/reviews` to send new reviews (Using retrieved token)
- [ ] Create a "Review Sidebar" that slides out when a song is clicked
- [ ] Display the "Average Rating" for each song

---

## Phase 5: List Builder
**Goal:** Provide a visual way to manage song lists.
- [ ] Build a "Create List" interface
- [ ] Drag-and-drop or click-to-add songs into a list
- [ ] View individual lists with full song details

---

## Phase 6: The Personal Vault (User Profiles)
**Goal:** A high-utility activity tracking page.
- [ ] Fetch profile stats (Review count, List count) from `GET /api/users/:id`
- [ ] Display a timeline of the user's latest music logs
- [ ] Shareable profile links

---

## Phase 7: Edge Polishing & Deployment
**Goal:** Finalize the industrial look and go live.
- [ ] Add loading animations (Hard-edged skeletons)
- [ ] Ensure mobile responsiveness (Everything stacks)
- [ ] Deploy frontend to **Vercel** or **Netlify**

---

## Current Progress
> **Phase:** Phase 2 — Authentication Bridge
> **Status:** UI is ready. Next step is to implement the login logic.

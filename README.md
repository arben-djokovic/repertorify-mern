# Repertorify – Guitar Songbook with Chords

Songbook for guitarists with lyrics and chords. Users browse and search songs, transpose them with one click, and build their own repertoire as playlists that can be reordered and downloaded as PDF. Anyone can browse; registered users can add their own songs and save playlists.

- **Website**: https://repertorify.com

Built with **React 18**, **Redux Toolkit**, **Node.js**, **Express** and **MongoDB (Mongoose)**.

## Features

### Songs

- **Lyrics with chords**: the chord parser finds chords in the song text (major, minor, 7th, sus, add, dim, aug and slash chords such as `C/G`), and they are shown above the lyrics.
- **Transposing**: move a song up or down by up to 5 semitones. For logged-in users the key is saved per song, so a song opens in the key they chose last time. This also applies to the PDF download.
- **Search** by title or artist, without caring about diacritics: `zdravkovic` finds `Zdravković`, and `dorde` finds `Đorđe`.
- Browse by genre, by artist (alphabetical index) and by popularity (how many playlists a song is in).
- Previous/next song navigation and "more songs by this artist".
- **PDF download** of any song.

### Playlists

- Create public or private playlists and pick a cover image.
- **Drag-and-drop ordering** of songs (`@dnd-kit`).
- Like other users' public playlists; they appear in the user's favourites.
- Download a whole playlist as one PDF, ready to print or use on a tablet at a gig.
- Top playlists on the home page.

### Accounts and admin

- Sign up and log in with a username and password (bcrypt).
- Profile with the user's songs, playlists and favourite playlists; change username and password.
- **Admin role**: manage genres, block and unblock users, and delete all songs from a user.

### Under the hood

- **Auth**: short-lived access token (JWT, 12 h) in the `Authorization` header, plus a refresh token (7 days) in an `httpOnly` cookie. The Axios client refreshes the access token automatically when it expires. The access and refresh tokens are signed with different secrets, and the server won't start if they match.
- **SEO for a single-page app**: Express serves the React build, but for song and playlist pages it adds the title, meta description, canonical link and the song text into `index.html` before sending it. Without that, crawlers see the same empty page for every URL. `react-helmet-async` takes over the tags on the client, and `/sitemap.xml` is generated from the database.
- **Security**: `helmet`, `hpp`, CORS limited to allowed origins, a global rate limit, and a stricter rate limit on login and sign-up. The `trust proxy` setting is set for exactly the two proxies in front of the app (Cloudflare and Render), so clients can't fake their IP to bypass the limits.
- Static files with a hash in the name are cached for one year. MongoDB indexes back the default song order and the "more by this artist" query.

## Tech Stack

| Area     | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React 18, React Router 6, Redux Toolkit, Redux Persist, Sass     |
| UI       | Framer Motion, Swiper, dnd-kit, Font Awesome, React Toastify     |
| Backend  | Node.js, Express                                                 |
| Database | MongoDB with Mongoose                                            |
| Auth     | JWT (`jsonwebtoken`), bcrypt, `httpOnly` refresh cookie          |
| PDF      | PDFKit                                                           |
| Security | helmet, hpp, express-rate-limit, CORS                            |

## Project Structure

```
backend/
├── config/          # Env config, chord parser and transposing, diacritic search, errors
├── controllers/     # Songs, playlists, genres, users, SEO rendering, sitemap
├── middlewares/     # JWT validation, user and admin route guards
├── models/          # Mongoose models: Song, Playlist, Genre, User
├── routes/          # REST routes under /api
├── public/fonts/    # Fonts used in the PDF exports
├── app.js           # Express app (security, routes, static build, SEO)
└── index.js         # DB connection and server start
frontend/
├── public/          # index.html, logo, playlist cover images
└── src/
    ├── api/         # Axios client with automatic token refresh
    ├── components/  # Header, sidebars, song/playlist items, modals, skeletons
    ├── controllers/ # Token and route helpers
    ├── pages/       # Home, Songs, Song, Artist, Genres, Playlists, Profile, forms, auth
    └── redux/       # Store and favourites slice (persisted)
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone and install

```bash
git clone https://github.com/arben-djokovic/repertorify-mern.git
cd repertorify-mern
npm install
npm install --prefix frontend
```

### 2. Environment variables

Create `.env` in the project root:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>

# Two different long random strings
JWT_SECRET=replace-with-a-long-random-string
REFRES_JWT_SECRET=replace-with-another-long-random-string

SONGS_PER_PAGE=20
PLAYLISTS_PER_PAGE=20
NODE_ENV=development
```

To generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> **Never commit `.env`.** It is already listed in `.gitignore`.

The frontend reads the API address from `frontend/.env.development` (`REACT_APP_API_URL=http://localhost:5000/api`). In production it uses the relative `/api`, because the backend serves the frontend.

### 3. Run

Start the API:

```bash
npm run dev
```

In a second terminal, start the frontend:

```bash
npm start --prefix frontend
```

Open [http://localhost:3000](http://localhost:3000).

To make a user an admin, set `role` to `"admin"` on their document in the `users` collection.

### Production

```bash
npm run build   # installs dependencies and builds the frontend
npm start       # serves the API and the frontend build from Express
```

## Deployment

The app runs as one Node service on Render, behind Cloudflare. Set the variables from `.env` in the service's environment settings, with `NODE_ENV=production`, so that Express serves the frontend build and the SEO pages.

## Author

Arben Djokovic – [GitHub](https://github.com/arben-djokovic)

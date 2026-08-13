# Bookworm

A social app for sharing and discovering book recommendations. Users sign up, post books with an image, caption and a 1–5 star rating, browse a paginated community feed, and manage their own recommendations from a profile screen.

The project is split into two parts:

- **`mobile/`** — the React Native / Expo client (Bookworm Mobile).
- **`backend/`** — the Express / MongoDB API (Bookworm Backend).

---

## Bookworm Mobile

**Location:** `mobile/`

### Purpose

A React Native / Expo application for browsing and posting book recommendations. It handles authentication (sign up / login / logout), displays a paginated community feed of book recommendations, lets users create new recommendations with an image and rating, and shows a profile of the user's own posts.

### Tech Stack

Taken from `mobile/package.json`:

- **Expo** `~57.0.11` with **React Native** `0.86.2` and **React** `19.2.3`
- **Expo Router** `~57.0.11` — file-based routing (`src/app`)
- **Zustand** `^5.0.14` — global state (auth store)
- **AsyncStorage** (`@react-native-async-storage/async-storage`) — persists auth token/user
- **expo-image** — optimized image rendering
- **expo-image-picker** + **expo-file-system** — picking and encoding book images (base64) for upload
- **@expo/vector-icons** (Ionicons), **react-native-safe-area-context**, **react-native-gesture-handler**, **expo-font**, **expo-splash-screen**
- **TypeScript** `~6.0.3` (see `tsconfig.json`)

### Key Features

- **Authentication** — Login and Sign Up screens (`src/app/(auth)/`); auth state and routing guarded by the Zustand store (`src/store/authStore.js`) with a custom alert modal for errors.
- **Community feed** — Home tab (`src/app/(tabs)/index.jsx`) renders a paginated feed of all recommendations with infinite-scroll (page/limit), pull-to-refresh, and star-rating display.
- **Post a recommendation** — Create tab (`src/app/(tabs)/create.jsx`): book title, caption, 1–5 rating picker, and image picker; the selected image is converted to a base64 data URL and sent to the backend for upload.
- **Profile** — Profile tab (`src/app/(tabs)/profile.jsx`): shows the logged-in user, their own recommendations, delete-with-confirmation, and logout.
- **API configuration** — Base URL is defined in `src/constants/api.js` (platform-specific: web points at `http://localhost:3000/api`, native at the deployed backend).

### Setup / Run

```bash
# from the mobile/ directory
npm install
npx expo start
```

From the Expo CLI output you can open the app in a development build, an Android emulator, an iOS simulator, or the Expo Go app.

**Configuration**

The mobile app does not read a `.env` file. To point the app at a different backend, edit the `API_URL` value in `src/constants/api.js`. For the app to function, the backend must be running (see below) and it must have a registered account to log in with.

---

## Bookworm Backend

**Location:** `backend/`

### Purpose

A REST API for the Bookworm app. It provides JWT-based authentication and CRUD for book recommendations, including uploading book cover images to Cloudinary. Bound by default to port `3000` and mounted at `/api`.

### Tech Stack

Taken from `backend/package.json`:

- **Express** `^5.2.1` — HTTP server and routing
- **Mongoose** `^9.9.1` — MongoDB ODM (models: `User`, `Book`)
- **jsonwebtoken** `^9.0.3` — JWT auth tokens
- **bcryptjs** `^3.0.3` — password hashing
- **Cloudinary** (cloudinary `^2.10.0`) — image uploads (book covers)
- **cors** `^2.8.6`, **dotenv** `^17.4.2`, **cron** `^4.4.0`
- **nodemon** (dev) — hot-reload development server

### Key Features

- **Authentication** (`/api/auth`) — `POST /register` and `POST /login`. Passwords are hashed with bcrypt on save; a JWT (`expiresIn: "15d"`) is issued on signup/login. On registration a profile avatar is auto-generated via DiceBear based on the username.
- **Protected book routes** (`/api/books`) — all book routes require a `Bearer` JWT via `protectRoute` middleware.
  - `POST /` — create a book recommendation (title, caption, image data URL, rating 1–5); the image is uploaded to Cloudinary and the returned URL is stored.
  - `GET /` — paginated list of all recommendations (`?page=` & `?limit=`), sorted newest-first, populating the author's username/avatar, with `totalPages`.
  - `GET /user` — returns the logged-in user's own recommendations (newest-first).
  - `DELETE /:id` — delete a recommendation; only the author can delete it, and the associated Cloudinary image is removed too.
- **Book model** — `title`, `caption`, `image`, `rating` (1–5), `user` reference, with timestamps.
- **Keep-alive cron** — a CronJob (`src/config/cron.js`) pings `API_URL` every 14 minutes to keep a free-host deployment (e.g. Render) awake.
- **Seed / reset scripts** — `scripts/populateDB.js` seeds classic books (Open Library covers uploaded to Cloudinary) for a specified user, and `scripts/resetDB.js` deletes a user's books (dry-run by default, use `--confirm` to delete).

### Environment Variables

Create a `.env` file in the `backend/` directory. The following variables are read from `process.env` (see `src/config/*.js`, `src/controllers/*.js`, `src/server.js`):

```
PORT
MONGODB_CONN_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
API_URL
```

> Note: There is no committed `.env.example`. Copy the variable names above into a local `.env` and fill in your own values (MongoDB connection string, JWT secret, and Cloudinary credentials). Never commit real values.

### Setup / Run

```bash
# from the backend/ directory
npm install
npm run dev        # starts with nodemon (auto-restart)
# or
npm start          # runs node ./src/server.js
```

The server connects to MongoDB and listens on `$PORT` (default `3000`). By default CORS allows `http://localhost:8081` (the running frontend).

**Useful scripts**

```bash
# seed the database with sample books for an existing user
node scripts/populateDB.js

# reset (delete) a user's books — dry run by default
node scripts/resetDB.js <userId>
node scripts/resetDB.js <userId> --confirm
```
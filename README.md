# Netix Streams

Build a complete, responsive movie/TV browsing web app called "Netix" — a personal, non-commercial streaming-style browser UI inspired by Netflix's visual language, styled distinctly to feel like its own product.

### TECH STACK & CONFIGURATION

- React + Vite + Tailwind CSS + shadcn/ui components.

- Client-side only architecture (no backend/auth required). All metadata comes from the free TMDB API.

- Use an environment variable `VITE_TMDB_API_KEY` via `import.meta.env`. Provide a placeholder `.env.example` file.

- Add an in-app "Settings / Developer" modal to input/update the TMDB API key if it is missing from environment variables.

- Include a fallback mechanism: If TMDB API calls fail or no key is set, attempt to fetch titles from fallback endpoints:

  - Movies: `https://vidrock.net/list/movie.json`

  - TV Shows: `https://vidrock.net/list/tv.json`

### BRANDING & VISUAL DIRECTION

- App Name: "Netix" displayed top-left in a fixed dark navbar.

- Palette: Near-black background (#0b0b0d), off-white text, and a distinct crimson accent (#d81f3f).

- Typography: Use a strong display sans (e.g., Bebas Neue via Google Fonts) for the logo and hero titles, paired with Inter for body text.

- Cards: Hover states scale up slightly with subtle drop-shadows and clean, restrained transitions.

- Fully responsive: Mobile features a collapsible mobile navigation menu/bottom bar; desktop displays the full top navbar.

### PAGES & NAVIGATION

1. Home Page (`/`):

   - Full-width hero banner at the top pulling from TMDB `trending/all/week`, featuring backdrop image, title, overview, "More Info" button, and rating/year metadata.

   - Horizontally scrollable poster rows with scroll arrows on desktop and touch-swipe on mobile:

     - Trending Now (`/trending/all/day`)

     - Popular Movies (`/movie/popular`)

     - Top Rated Movies (`/movie/top_rated`)

     - Popular TV Shows (`/tv/popular`)

     - Top Rated TV Shows (`/tv/top_rated`)

     - Genre Rows (Action, Comedy, Sci-Fi using TMDB discover endpoints).

2. Search Page (`/search`):

   - Dynamic search input in the navbar routing to `/search?q=`.

   - Debounced search querying TMDB `/search/multi`, rendering a responsive poster grid.

3. Browse Pages (`/movies` and `/tv-shows`):

   - Paginated grids with genre filter dropdowns.

4. Title Detail Page (`/title/:mediaType/:tmdbId`):

   - Large backdrop header, poster, title, year, runtime/seasons, genres, overview, TMDB rating, and cast list (`/credits`).

   - For TV Shows: Dynamic season selector tabs loading individual episodes (`/tv/:id/season/:season_number`) displaying episode number, title, thumbnail, and overview.

   - Responsive **Player Slot** section (see specification below).

   - "More Like This" row at the bottom using TMDB recommendations.

5. Manage Sources Page (`/manage-sources`):

   - An admin overview listing every title/episode that has a saved custom source, allowing quick editing or deletion without navigating through title pages.

6. My List Page (`/my-list`):

   - Watchlist page displaying saved titles (toggled via heart/plus icons on poster cards and saved to localStorage).

---

### GENERIC PLAYER SLOT SPECIFICATION

Build a source-agnostic, generic embed slot for every movie and TV episode. Do NOT hardcode or reference pre-filled external streaming domains in the source code.

1. Local Storage Keying Structure:

   - Movies: `netix_source_movie_{tmdbId}`

   - TV Episodes: `netix_source_tv_{tmdbId}_{season}_{episode}`

2. User Interface & Workflow:

   - If no source is saved: Display a clean placeholder state with a play icon, "No source added yet" text, and an "Add Source" button.

   - Clicking "Add Source" opens a modal/form with a single input area supporting:

     (a) Plain iframe URL (e.g., `https://vidrock.net/movie/tt4154796` or `https://vidrock.net/tv/tt0903747/1/1`) -> Rendered inside a 16:9 dynamic `<iframe>`.

     (b) Full `<iframe>` HTML snippet (e.g., `<iframe src="https://vidrock.net/movie/tt4154796" allowfullscreen></iframe>`) -> Parsed and sanitized to render the iframe element cleanly.

     (c) Direct video file link (`.mp4`, `.webm`) -> Rendered in a native HTML5 `<video controls>` player.

   - Include options to "Edit Source" and "Remove Source" once a link is active.

   - Ensure the player container is responsive (16:9 ratio) with rounded corners matching the UI design.

---

### CODE QUALITY & COMPONENTIZATION

Keep the codebase strictly componentized:

- `PosterCard.jsx`

- `MediaRow.jsx`

- `HeroBanner.jsx`

- `PlayerSlot.jsx`

- `SeasonSelector.jsx`

- `Navbar.jsx`

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a468974-717f-4ddd-83ed-9e35d651ab00).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

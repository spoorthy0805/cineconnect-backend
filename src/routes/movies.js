import express from "express"

const router = express.Router()

// ---- STATIC MOVIE LIST (No APIs, No Errors, Always Works) ----
const MOVIES = [
  {
    tmdbId: "tt15398776",
    title: "Oppenheimer",
    year: "2023",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNjk5Yzc5ZTAtNGE0NS00Mjk4LWEzOTctODZlYTNlNmQ3OWMzXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    overview:
      "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb."
  },
  {
    tmdbId: "tt1517268",
    title: "Barbie",
    year: "2023",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BN2FkNDRjNmMtZmMxYy00N2QzLTljNzItODlkY2ZkMTgwNWI5XkEyXkFqcGdeQXVyMTY1MzAyNzY@._V1_FMjpg_UX1000_.jpg",
    overview: "Barbie suffers a crisis that leads her to question her life."
  },
  {
    tmdbId: "tt1877830",
    title: "The Batman",
    year: "2022",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjA4N2Q0YTEtYmIxZi00YmNmLTkyMTMtNzI4Y2ExNjNjMzg1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    overview: "Batman uncovers corruption in Gotham related to his own family."
  },
  {
    tmdbId: "tt4633694",
    title: "Spider-Man: Into the Spider-Verse",
    year: "2018",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMzUwY2Q4MWEtMTMzZi00MzgxLTg0YzAtMjg1NGIwNTU3MTRiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    overview:
      "Teenager Miles Morales becomes Spider-Man and meets alternate versions from other dimensions."
  },
  {
    tmdbId: "tt1375666",
    title: "Inception",
    year: "2010",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
    overview:
      "A thief steals corporate secrets through dream-sharing technology."
  },
  {
    tmdbId: "tt0816692",
    title: "Interstellar",
    year: "2014",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjIxNjcxMzY4MF5BMl5BanBnXkFtZTgwNjU5NzY3MjE@._V1_.jpg",
    overview:
      "A team of explorers travel through a wormhole in search of a new home for humanity."
  },
  {
    tmdbId: "tt4154796",
    title: "Avengers: Endgame",
    year: "2019",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjMxNjY2NjY1NV5BMl5BanBnXkFtZTgwODk2NTU3NjM@._V1_.jpg",
    overview:
      "The Avengers assemble once more to undo Thanos’ actions and restore balance."
  },
  {
    tmdbId: "tt7286456",
    title: "Joker",
    year: "2019",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNGRlZjA4M2UtYWI3My00M2FiLWI5MzgtZWNmNmZmNThhZDM3XkEyXkFqcGdeQXVyMTA1OTAyOTY5._V1_.jpg",
    overview:
      "A mentally troubled comedian embarks on a downward spiral that leads to Gotham’s crime world."
  },
  {
    tmdbId: "tt4630562",
    title: "The Fate of the Furious",
    year: "2017",
    type: "movie",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTg2MTIzOTEyN15BMl5BanBnXkFtZTgwNjQ0NDY0MTI@._V1_FMjpg_UX1000_.jpg",
    overview:
      "Dom is forced to betray his family when a mysterious woman seduces him into crime."
  }
]

// ---------- TRENDING ----------
router.get("/trending", (req, res) => {
  res.json(MOVIES)
})

// ---------- SEARCH ----------
router.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase()
  if (!q) return res.json(MOVIES)

  const filtered = MOVIES.filter((m) =>
    m.title.toLowerCase().includes(q)
  )

  res.json(filtered)
})

// ---------- TEST ----------
router.get("/test", (req, res) => {
  res.json({ message: "router works" })
})

export default router

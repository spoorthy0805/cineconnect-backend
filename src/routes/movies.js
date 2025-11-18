import express from "express"

const router = express.Router()

const MOVIES = [
  {
    tmdbId: "tt15398776",
    title: "Oppenheimer",
    year: "2023",
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNjk5Yzc5ZTAt.jpg",
    overview:
      "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb."
  },
  {
    tmdbId: "tt1517268",
    title: "Barbie",
    year: "2023",
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2FkNDRjNmMt.jpg",
    overview:
      "Barbie suffers a crisis that leads her to question her world and her existence."
  },
  {
    tmdbId: "tt1160419",
    title: "Dune",
    year: "2021",
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BY2I1N2JkZjMt.jpg",
    overview:
      "Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis."
  },
  {
    tmdbId: "tt1877830",
    title: "The Batman",
    year: "2022",
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZTNkZTdiMGEt.jpg",
    overview:
      "Batman uncovers corruption in Gotham City that connects to his own family."
  },
  {
    tmdbId: "tt728

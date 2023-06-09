const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const validate = require('../middlewares/validate');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies)
});

router.post('/', validate(validateMovie), async (req, res) => {
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send('genre not found');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    await movie.save();
    res.send(movie);
});

router.put('/:id', validate(validateMovie), async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            // genre: 
        }
    }, { new: true });
    if (!movie) return res.status(404).send('The movie with given id was not found.');
    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('The movie with given id was not found.');
    res.send(movie);
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with given id was not found.');
    res.send(movie);
});

module.exports = router;
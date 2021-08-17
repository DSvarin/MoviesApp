import React from 'react';

import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';

import { GenresConsumer } from '../genres-context/genres-context';

import './movie-card.css';

const MovieCard = ({
  poster_path: posterPath,
  title,
  vote_average: voteAverage,
  release_date: releaseDate,
  overview,
  genre_ids: genreIds,
  id,
  addRatedMovie,
  ratedMovies,
}) => {
  const posterLink = `https://www.themoviedb.org/t/p/w220_and_h330_face/${posterPath}`;
  let date;
  if (!releaseDate) {
    date = 'Unknown';
  } else {
    date = format(new Date(releaseDate), 'MMMM d, y');
  }

  const textTrunc = (text, wordsAmount) => {
    const textArr = text.split(' ');
    let newText = '';

    if (text.length === 0) {
      return `Sorry... We know nothing about this movie.`;
    }

    if (textArr.length > wordsAmount) {
      newText = `${textArr.slice(0, wordsAmount + 1).join(' ')} ...`;
    } else if (textArr.length < wordsAmount) return text;
    return newText;
  };

  const getCircleColor = (rating) => {
    if (rating >= 0 && rating < 3) return 'vote-circle red';
    if (rating >= 3 && rating < 5) return 'vote-circle orange';
    if (rating >= 5 && rating < 7) return 'vote-circle yellow';
    return 'vote-circle green';
  };

  const getGenresOfMovie = (genreIdsArr, genreList) => {
    const GenresOfMovie = [];

    const filteredGenreList = genreList.filter((item) => genreIdsArr.indexOf(item.id) > -1);
    filteredGenreList.map((item) => GenresOfMovie.push(item.name));

    return GenresOfMovie;
  };

  const getRatedMovie = (value) => {
    addRatedMovie(id, value);
  };

  const getRatingOfMovie = (movieId, ratedMovieArr) => {
    const movie = ratedMovieArr.find((item) => item.movieId === movieId);

    if (movie === undefined) return 0;
    return movie.rating;
  };

  return (
    <GenresConsumer>
      {(genres) => (
        <span className="movie-item">
          <div className="movie-item__poster">
            <img src={posterLink} alt={title} />
          </div>
          <div className="movie-item__info">
            <div className="movie-item__header">
              <h5>{title}</h5>
              <div className={getCircleColor(voteAverage)}>{voteAverage}</div>
            </div>
            <div className="movie-item__release-date">{date}</div>
            <Genres genresArr={getGenresOfMovie(genreIds, genres)} />
            <div className="movie-item__overview">{textTrunc(overview, 20)}</div>
            <Rate count={10} onChange={getRatedMovie} value={getRatingOfMovie(id, ratedMovies)} />
          </div>
        </span>
      )}
    </GenresConsumer>
  );
};

MovieCard.defaultProps = {
  poster_path: 'https://english-grammar.biz/dictionary/img/wlibrary/o/60280db5537709.73724661.jpg',
  title: 'Title not found',
  vote_average: 100,
  release_date: null,
  overview: 'Amaizing film. Overview not found',
  genre_ids: [],
  id: '',
  addRatedMovie: () => {},
  ratedMovies: [],
};

MovieCard.propTypes = {
  poster_path: PropTypes.string,
  title: PropTypes.string,
  vote_average: PropTypes.number,
  release_date: PropTypes.string,
  overview: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  id: PropTypes.number,
  addRatedMovie: PropTypes.func,
  ratedMovies: PropTypes.arrayOf(PropTypes.object),
};

export default MovieCard;

const Genres = ({ genresArr }) => {
  const genre = genresArr.map((item) => <li key={item}> {item} </li>);
  return <ul className="movie-item__genres"> {genre} </ul>;
};

Genres.defaultProps = {
  genresArr: [],
};

Genres.propTypes = {
  genresArr: PropTypes.arrayOf(PropTypes.string),
};

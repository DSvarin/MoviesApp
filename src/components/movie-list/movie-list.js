import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Alert, Pagination } from 'antd';

import MovieCard from '../movie-card';

import 'antd/dist/antd.css';
import './movie-list.css';

const MovieList = ({
  movies,
  loading,
  error,
  currentPage,
  onPageChange,
  totalPage,
  addRatedMovie,
  ratedMovies,
  tab,
  ratedMoviesServer,
  ratedMoviesTotal,
}) => {
  if (!movies) {
    return <Spin size="large" />;
  }

  if (movies.length === 0) {
    return <Alert type="info" message="Whoops!" description="Could not find this movie." />;
  }

  const createMovieCards = (moviesArr) =>
    moviesArr.map((item) => {
      const { id } = item;

      return (
        <li key={id}>
          <MovieCard {...item} addRatedMovie={addRatedMovie} ratedMovies={ratedMovies} />
        </li>
      );
    });

  const elements = tab === 'Rated' ? createMovieCards(ratedMoviesServer) : createMovieCards(movies);

  const hasData = !(loading || error);

  const totalPageAmount = tab === 'Rated' ? ratedMoviesTotal : totalPage * 20;
  console.log(ratedMoviesTotal);

  const errorMess = error ? (
    <Alert type="error" message="Whoops!" description="Sorry! We lost movies. Someone stole them." />
  ) : null;
  const spinner = loading ? <Spin size="large" /> : null;
  const content = hasData ? (
    <>
      <ul className="move-list"> {elements} </ul>
      <Pagination
        current={currentPage}
        size="small"
        pageSize={20}
        total={totalPageAmount}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </>
  ) : null;

  return (
    <>
      {errorMess}
      {spinner}
      {content}
    </>
  );
};

MovieList.defaultProps = {
  movies: [],
  loading: false,
  error: true,
  currentPage: 1,
  onPageChange: () => {},
  totalPage: 20,
  addRatedMovie: () => {},
  tab: 'Search',
  ratedMovies: [],
  ratedMoviesServer: [],
  ratedMoviesTotal: 1,
};

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.bool,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  totalPage: PropTypes.number,
  addRatedMovie: PropTypes.func,
  tab: PropTypes.string,
  ratedMovies: PropTypes.arrayOf(PropTypes.object),
  ratedMoviesServer: PropTypes.arrayOf(PropTypes.object),
  ratedMoviesTotal: PropTypes.number,
};

export default MovieList;

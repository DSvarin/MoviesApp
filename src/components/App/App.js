/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';

import MoviesapiService from '../../services/moviapi-serves';

import Tab from '../tab-search-rated';
import MovieSearch from '../movie-search';
import MovieList from '../movie-list';

import { GenresProvider } from '../genres-context/genres-context';

import './App.css';

export default class App extends Component {
  moviesapiService = new MoviesapiService();

  state = {
    query: 'return',
    currentPage: 1,
    totalPage: null,
    movies: null,
    genres: null,
    loading: true,
    error: false,
    tab: 'Search',
    ratedMovies: [],
    guestSessionId: null,
    ratedMoviesServer: [],
    ratedMoviesTotal: null,
  };

  componentDidMount() {
    this.moviesapiService.createGuestSessionId().then(this.onIdCreated).catch(this.onError);
    this.moviesapiService.getGenresList().then(this.onGenresLoaded).catch(this.onError);
    this.updateTotalPage();
    this.updateMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.updateMovies();
      this.updateTotalPage();
    }
    if (this.state.currentPage !== prevState.currentPage) {
      this.updateMovies();
    }
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  addRatedMovie = (movieId, rating) => {
    if (rating > 0) {
      const { ratedMovies, guestSessionId } = this.state;

      this.moviesapiService.postRatedMovie(movieId, guestSessionId, rating).catch(this.onError);

      this.setState(() => {
        const newDat = ratedMovies.filter((item) => item.movieId !== movieId);
        const newData = [...newDat, { movieId, rating }];

        return {
          ratedMovies: newData,
        };
      });
    }
  };

  onMoviesLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
    });
  };

  onPagesLoaded = (totalPage) => {
    this.setState({
      totalPage,
      loading: false,
    });
  };

  onGenresLoaded = (genres) => {
    this.setState({
      genres,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onQueryChange = (query) => {
    this.setState({ query });
  };

  onPageChange = (currentPage) => {
    this.setState({ currentPage });
  };

  onTabRated = (sessionId, page) => {
    console.log(page);
    this.moviesapiService
      .getRatedMovies(sessionId, page)
      .then((ratedMoviesServer) => this.setState({ ratedMoviesServer }))
      .catch(this.onError);
  };

  onTabChange = (tab) => {
    this.setState({ tab });
    this.setState({ currentPage: 1 });
    if (tab === 'Rated') {
      const { guestSessionId } = this.state;

      this.moviesapiService
        .getRatedMoviesTotal(guestSessionId)
        .then((ratedMoviesTotal) => this.setState({ ratedMoviesTotal }))
        .catch(this.onError);
      const { currentPage } = this.state;

      this.onTabRated(guestSessionId, currentPage);
    }
  };

  onIdCreated = (guestSessionId) => {
    this.setState({ guestSessionId });
  };

  updateMovies() {
    const { query, currentPage } = this.state;
    if (!query || !currentPage) {
      return;
    }

    this.moviesapiService.searchMovies(query, currentPage).then(this.onMoviesLoaded).catch(this.onError);
  }

  updateTotalPage() {
    const { query } = this.state;
    if (!query) {
      return;
    }
    this.moviesapiService.getPagesAmount(query).then(this.onPagesLoaded).catch(this.onError);
  }

  render() {
    const {
      currentPage,
      totalPage,
      movies,
      genres,
      loading,
      error,
      tab,
      ratedMovies,
      ratedMoviesServer,
      ratedMoviesTotal,
    } = this.state;
    console.log(this.state);

    const movieSearch = tab === 'Search' ? <MovieSearch onQueryChange={this.onQueryChange} /> : null;

    return (
      <div className="main">
        <Tab onTabChange={this.onTabChange} tab={tab} />
        {movieSearch}
        <GenresProvider value={genres}>
          <MovieList
            movies={movies}
            loading={loading}
            error={error}
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={this.onPageChange}
            addRatedMovie={this.addRatedMovie}
            tab={tab}
            ratedMovies={ratedMovies}
            ratedMoviesServer={ratedMoviesServer}
            ratedMoviesTotal={ratedMoviesTotal}
          />
        </GenresProvider>
      </div>
    );
  }
}

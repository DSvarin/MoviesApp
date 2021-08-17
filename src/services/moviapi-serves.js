export default class MoviesapiService {
  _apiKey = '6bf0feb23818a67543ed62ff0b165815';
  // eslint-disable-next-line lines-between-class-members
  _apiBase = 'https://api.themoviedb.org/3/';

  async getResource(url, query = null, page = 1) {
    const response = await fetch(`${this._apiBase}${url}?api_key=${this._apiKey}&query=%22${query}&page=${page}`);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }

    const jsonresp = await response.json();
    return jsonresp;
  }

  async createGuestSessionId() {
    const res = await this.getResource(`authentication/guest_session/new`);
    return res.guest_session_id;
  }

  async searchMovies(query, page) {
    const res = await this.getResource(`search/movie`, query, page);
    return res.results;
  }

  async getGenresList() {
    const res = await this.getResource(`genre/movie/list`);
    return res.genres;
  }

  async getPagesAmount(query) {
    const res = await this.getResource(`search/movie`, query);
    return res.total_pages;
  }

  async getRatedMovies(guestSessionId, page) {
    const res = await this.getResource(`guest_session/${guestSessionId}/rated/movies`, null, page);
    return res.results;
  }

  async getRatedMoviesTotal(guestSessionId) {
    const res = await this.getResource(`guest_session/${guestSessionId}/rated/movies`);
    return res.total_results;
  }

  async postRatedMovie(movieId, sessionId, value) {
    const response = await fetch(
      `${this._apiBase}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value }),
      }
    );

    if (!response.ok) {
      throw new Error(`Could not post rated movie, received ${response.status}`);
    }
  }
}

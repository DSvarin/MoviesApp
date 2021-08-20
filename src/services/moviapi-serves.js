export default class MoviesapiService {
  _apiKey = '6bf0feb23818a67543ed62ff0b165815';

  _apiBase = 'https://api.themoviedb.org/3/';

  async getResource(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }

    const jsonresp = await response.json();
    return jsonresp;
  }

  async createGuestSessionId() {
    const res = await this.getResource(`${this._apiBase}authentication/guest_session/new?api_key=${this._apiKey}`);
    return res.guest_session_id;
  }

  async searchMovies(query, page) {
    const res = await this.getResource(
      `${this._apiBase}search/movie?api_key=${this._apiKey}&query=%22${query}&page=${page}`
    );
    return res.results;
  }

  async getGenresList() {
    const res = await this.getResource(`${this._apiBase}genre/movie/list?api_key=${this._apiKey}`);
    return res.genres;
  }

  async getPagesAmount(query) {
    const res = await this.getResource(`${this._apiBase}search/movie?api_key=${this._apiKey}&query=%22${query}`);
    return res.total_pages;
  }

  async getRatedMovies(guestSessionId, page) {
    const res = await this.getResource(
      `${this._apiBase}guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`
    );
    return res.results;
  }

  async getRatedMoviesTotal(guestSessionId) {
    const res = await this.getResource(
      `${this._apiBase}guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}`
    );
    return res.total_results;
  }

  async postRatedMovie(movieId, sessionId, value) {
    this.getResource(`${this._apiBase}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value }),
    });
  }
}

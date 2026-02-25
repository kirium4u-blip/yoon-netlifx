(function () {
  const API_BASE = 'https://api.themoviedb.org/3/movie/now_playing';
  const API_KEY = '93cf67651df889b47d1ebf7f4c5e3dfa';
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const gridEl = document.getElementById('movies-grid');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error-msg');

  function showError(message) {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  }

  function createMovieCard(movie) {
    const posterPath = movie.poster_path
      ? IMAGE_BASE + movie.poster_path
      : '';
    const title = movie.title || '제목 없음';

    const card = document.createElement('article');
    card.className = 'movie-card';
    card.innerHTML = `
      <div class="movie-poster-wrap">
        <img
          class="movie-poster ${!posterPath ? 'placeholder' : ''}"
          src="${posterPath || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'}"
          alt="${title}"
          loading="lazy"
        />
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${escapeHtml(title)}</h3>
      </div>
    `;
    return card;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderMovies(movies) {
    if (!gridEl) return;
    if (loadingEl) loadingEl.classList.add('hidden');
    errorEl.hidden = true;

    gridEl.innerHTML = '';
    movies.forEach(function (movie) {
      gridEl.appendChild(createMovieCard(movie));
    });
  }

  function fetchNowPlaying() {
    const url = API_BASE + '?api_key=' + API_KEY + '&language=ko-KR';
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('영화 목록을 불러오지 못했습니다. (HTTP ' + res.status + ')');
        return res.json();
      })
      .then(function (data) {
        const results = data.results || [];
        if (results.length === 0) {
          showError('현재 상영 중인 영화가 없습니다.');
          return;
        }
        renderMovies(results);
      })
      .catch(function (err) {
        showError(err.message || '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      });
  }

  fetchNowPlaying();
})();

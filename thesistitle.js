// ════════════════════════════════════════
// DATA — will be loaded from thesisData.json
// ════════════════════════════════════════
let THESES = [];

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
let currentPage = 'page-home';

function goTo(pageId, data = null) {
  const from = document.getElementById(currentPage);
  const to   = document.getElementById(pageId);

  from.classList.add('exit');
  setTimeout(() => {
    from.classList.remove('active', 'exit');
    to.classList.add('active');
    to.scrollTop = 0;
    window.scrollTo(0, 0);
    currentPage = pageId;
    if (pageId === 'page-detail' && data !== null) renderDetail(data);
    if (pageId === 'page-titles') {
      document.getElementById('search-input').value = '';
      filterCards();
    }
  }, 320);
}


// ════════════════════════════════════════
// RENDER TITLES GRID
// ════════════════════════════════════════
function renderGrid(list) {
  const grid  = document.getElementById('thesis-grid');
  const shown = document.getElementById('count-shown');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `<div class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>No titles match your search.<br>Try different keywords.</p>
      </div>`;
    shown.textContent = 0;
    return;
  }

  list.forEach((t, i) => {
    const realIndex = THESES.indexOf(t);
    const num = String(realIndex + 1).padStart(2, '0');
    const card = document.createElement('div');
    card.className = 'thesis-card';
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <span class="card-index">THESIS — ${num}</span>
      <div class="card-title">${t.title}</div>
      <div class="card-tags">${t.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
      <div class="card-footer">
        <span class="card-year">${t.year}</span>
        <div class="card-arrow">→</div>
      </div>`;
    card.addEventListener('click', () => goTo('page-detail', realIndex));
    grid.appendChild(card);
  });

  shown.textContent = list.length;
}

function filterCards() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const filtered = THESES.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q)) ||
    t.area.toLowerCase().includes(q)
  );
  renderGrid(filtered);
}


// ════════════════════════════════════════
// RENDER DETAIL
// ════════════════════════════════════════
function renderDetail(index) {
  const t   = THESES[index];
  const num = String(index + 1).padStart(2, '0');

  document.getElementById('detail-index').textContent = `Thesis No. ${num} · ${t.area}`;
  document.getElementById('detail-title').textContent  = t.title;
  document.getElementById('detail-desc').innerHTML     = t.description.split('\n\n').map(p => `<p>${p}</p>`).join('');
  document.getElementById('detail-objectives').innerHTML = t.objectives.split('\n\n').map(p => `<p>${p}</p>`).join('');

  const metaHtml = t.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  document.getElementById('detail-meta').innerHTML = metaHtml;
  document.getElementById('sb-tags').innerHTML     = metaHtml;
  document.getElementById('sb-index').textContent  = `#${num}`;
  document.getElementById('sb-area').textContent   = t.area;
  document.getElementById('sb-year').textContent   = t.year;
}


// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
function initApp() {
  document.getElementById('stat-count').innerHTML = `${THESES.length}<span>+</span>`;
  document.getElementById('count-total').textContent = THESES.length;
  renderGrid(THESES);
}

// Load the thesis data from JSON file
fetch('thesisData.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    THESES = data;
    initApp();
  })
  .catch(error => {
    console.error('Error loading thesis data:', error);
    // Optionally, show an error message to the user
    document.getElementById('thesis-grid').innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">⚠️</div>
        <p>Failed to load thesis data. Please check the console for details.</p>
      </div>`;
    document.getElementById('count-shown').textContent = '0';
    document.getElementById('count-total').textContent = '0';
    document.getElementById('stat-count').innerHTML = `0<span>+</span>`;
  });

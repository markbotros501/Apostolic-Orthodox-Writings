document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const authorId = params.get('id');

    if (!authorId) {
        window.location.href = 'index.html';
        return;
    }

    const father = window.patristicDB.fathers.find(f => f.id === authorId);

    if (!father) {
        document.querySelector('main').innerHTML = '<h1>Author not found</h1><p><a href="index.html">Return to Home</a></p>';
        return;
    }

    // Update Page Title
    document.title = `${father.name} - Apostolic Orthodox Writings`;

    // Update Breadcrumb
    document.getElementById('breadcrumb-name').textContent = father.name;

    // Update Header
    document.getElementById('author-name').textContent = father.name;
    document.getElementById('author-dates').textContent = father.dates;

    // Load works from manifest file if it exists, otherwise use data.js
    const manifestPath = `pages/fathers/${father.id}/works-manifest.json`;
    const worksList = document.getElementById('works-list');
    
    // Try to load from manifest first (add cache-busting parameter)
    fetch(`${manifestPath}?t=${Date.now()}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Manifest not found');
        })
        .then(manifestWorks => {
            // Use works from manifest
            console.log('Loaded manifest works:', manifestWorks);
            console.log('Number of works:', manifestWorks.length);
            renderWorks(manifestWorks);
        })
        .catch((error) => {
            console.error('Error loading manifest:', error);
            // Fallback to works from data.js
            if (father.works && father.works.length > 0) {
                console.log('Using fallback works from data.js:', father.works);
                renderWorks(father.works);
            } else {
                worksList.innerHTML = '<li class="no-works">No works available for this author yet.</li>';
            }
        });

    function renderWorks(works) {
        worksList.innerHTML = '';
        if (works && works.length > 0) {
            works.forEach(work => {
                const li = document.createElement('li');
                li.innerHTML = `
        <a href="work.html?id=${work.id}" class="work-link">
          <span class="work-title">${work.title}</span>
        </a>
      `;
                worksList.appendChild(li);
            });
        } else {
            worksList.innerHTML = '<li class="no-works">No works available for this author yet.</li>';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Apostolic Orthodox Writings Loaded');

    const fathersList = document.getElementById('fathers-list');

    // Initial Render (only if fathersList exists)
    if (fathersList) {
        // Filter only Cyril, Severus, and John Chrysostom
        const filteredFathers = window.patristicDB.fathers.filter(father =>
            father.id === 'cyril-alexandria' || father.id === 'severus-antioch' || father.id === 'john-chrysostom'
        );

        // Sort by dates (earlier first)
        filteredFathers.sort((a, b) => {
            const aYear = parseInt(a.dates.match(/\d+/)[0]);
            const bYear = parseInt(b.dates.match(/\d+/)[0]);
            return aYear - bYear;
        });

        loadWorksAndRender(filteredFathers);
    }

    function getWorksForFather(father) {
        const manifestPath = `pages/fathers/${father.id}/works-manifest.json`;
        return fetch(`${manifestPath}?t=${Date.now()}`)
            .then(response => response.ok ? response.json() : Promise.reject())
            .catch(() => (father.works && father.works.length > 0 ? father.works : []));
    }

    function loadWorksAndRender(fathers) {
        Promise.all(fathers.map(father => getWorksForFather(father).then(works => ({ father, works }))))
            .then(fathersWithWorks => renderFathers(fathersWithWorks));
    }

    function renderFathers(fathersWithWorks) {
        fathersList.innerHTML = '';

        if (fathersWithWorks.length === 0) {
            fathersList.innerHTML = '<p class="no-results">No fathers found.</p>';
            return;
        }

        fathersWithWorks.forEach(({ father, works }) => {
            const card = document.createElement('article');
            card.className = 'card card-with-works';

            const nameDateRow = document.createElement('div');
            nameDateRow.className = 'card-header';
            nameDateRow.innerHTML = `
        <h3>Saint ${father.name}</h3>
        <p class="dates">${father.dates}</p>
      `;

            card.appendChild(nameDateRow);

            const worksSection = document.createElement('section');
            worksSection.className = 'card-works';
            const worksList = document.createElement('ul');
            worksList.className = 'works-list';
            if (works && works.length > 0) {
                works.forEach(work => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="work.html?id=${work.id}" class="work-link"><span class="work-title">${work.title}</span></a>`;
                    worksList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.className = 'no-works';
                li.textContent = 'No works available yet.';
                worksList.appendChild(li);
            }
            worksSection.appendChild(worksList);
            card.appendChild(worksSection);

            fathersList.appendChild(card);
        });
    }
});

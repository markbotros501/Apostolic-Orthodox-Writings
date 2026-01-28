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
        // John Chrysostom: c. 349-407 AD, Cyril: 376-444 AD, Severus: 465-538 AD
        filteredFathers.sort((a, b) => {
            const aYear = parseInt(a.dates.match(/\d+/)[0]);
            const bYear = parseInt(b.dates.match(/\d+/)[0]);
            return aYear - bYear;
        });
        
        renderFathers(filteredFathers);
    }

    function renderFathers(fathers) {
        fathersList.innerHTML = '';

        if (fathers.length === 0) {
            fathersList.innerHTML = '<p class="no-results">No fathers found.</p>';
            return;
        }

        fathers.forEach(father => {
            const card = document.createElement('article');
            card.className = 'card';
            card.style.cursor = 'pointer';

            // Make card clickable
            card.addEventListener('click', () => {
                window.location.href = `author.html?id=${father.id}`;
            });

            const nameDateRow = document.createElement('div');
            nameDateRow.className = 'card-header';
            nameDateRow.innerHTML = `
        <h3>Saint ${father.name}</h3>
        <p class="dates">${father.dates}</p>
      `;

            card.appendChild(nameDateRow);
            fathersList.appendChild(card);
        });
    }

});

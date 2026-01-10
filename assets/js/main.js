document.addEventListener('DOMContentLoaded', () => {
    console.log('Apostolic Orthodox Writings Loaded');

    const fathersList = document.getElementById('fathers-list');

    // Initial Render (only if fathersList exists)
    if (fathersList) {
        // Filter only Cyril and Severus
        const filteredFathers = window.patristicDB.fathers.filter(father => 
            father.id === 'cyril-alexandria' || father.id === 'severus-antioch'
        );
        
        // Sort by dates (earlier first)
        // Cyril: 376-444 AD, Severus: 465-538 AD
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

        const list = document.createElement('ul');
        list.className = 'fathers-list';

        fathers.forEach(father => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `author.html?id=${father.id}`;
            link.className = 'father-link';
            link.innerHTML = `<span class="father-name">Saint ${father.name}</span> <span class="father-dates">${father.dates}</span>`;
            li.appendChild(link);
            list.appendChild(li);
        });

        fathersList.appendChild(list);
    }

});

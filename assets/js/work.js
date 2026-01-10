document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const workId = params.get('id');

    if (!workId) {
        window.location.href = 'index.html';
        return;
    }

    // Find work and father - check manifest files first, then data.js
    let foundWork = null;
    let foundFather = null;

    // First, try to find in data.js
    for (const father of window.patristicDB.fathers) {
        const work = father.works.find(w => w.id === workId);
        if (work) {
            foundWork = work;
            foundFather = father;
            break;
        }
    }

    // If not found, try loading from manifest files
    if (!foundWork || !foundFather) {
        const checkManifests = async () => {
            for (const father of window.patristicDB.fathers) {
                try {
                    const manifestPath = `pages/fathers/${father.id}/works-manifest.json`;
                    const response = await fetch(manifestPath);
                    if (response.ok) {
                        const manifestWorks = await response.json();
                        const work = manifestWorks.find(w => w.id === workId);
                        if (work) {
                            foundWork = work;
                            foundFather = father;
                            break;
                        }
                    }
                } catch (e) {
                    // Continue to next father
                }
            }
            
            if (!foundWork || !foundFather) {
                document.querySelector('main').innerHTML = '<h1>Work not found</h1><p><a href="index.html">Return to Home</a></p>';
                return;
            }
            
            loadWorkContent();
        };
        
        checkManifests();
        return;
    }

    loadWorkContent();

    function loadWorkContent() {
        // Update Metadata
    document.title = `${foundWork.title} - Apostolic Orthodox Writings`;
    document.getElementById('breadcrumb-father').textContent = foundFather.name;
    document.getElementById('breadcrumb-father').href = `author.html?id=${foundFather.id}`;
    document.getElementById('breadcrumb-work').textContent = foundWork.title;

    document.getElementById('work-title').textContent = foundWork.title;
    document.getElementById('work-author').textContent = foundFather.name;
    document.getElementById('work-date').textContent = foundFather.dates; // Using father's dates for now as proxy

    // Fetch Content
    // Ensure path is properly encoded for URLs (handle spaces and special characters)
    // Split path and encode each segment, then rejoin
    const rawPath = foundWork.path;
    const pathParts = rawPath.split('/');
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const workPath = encodedParts.join('/');
    console.log('Fetching work from:', workPath);
    console.log('Original path:', rawPath);
    
    fetch(workPath)
        .then(response => {
            console.log('Response status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} - Failed to load ${workPath}`);
            }
            return response.text();
        })
        .then(html => {
            // Parse the HTML to extract styles and content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract style tags from head to preserve original formatting
            const styleTags = doc.querySelectorAll('head style');
            let stylesHTML = '';
            styleTags.forEach(style => {
                stylesHTML += style.outerHTML;
            });

            // Get the body content
            let bodyContent = '';
            if (doc.body && doc.body.innerHTML.trim().length > 0) {
                bodyContent = doc.body.innerHTML;
            } else {
                // Fallback for plain text or fragments
                bodyContent = html;
            }

            // Preserve original format by including styles and body content
            document.getElementById('work-content').innerHTML = stylesHTML + bodyContent;
            
            // Force center alignment on h1 titles after content loads
            const h1Elements = document.querySelectorAll('#work-content h1, .work-content h1');
            h1Elements.forEach(h1 => {
                h1.style.textAlign = 'center';
            });
            
            // Force center alignment on h2 titles in work-index sections
            const indexH2Elements = document.querySelectorAll('#work-content .work-index h2, .work-content .work-index h2');
            indexH2Elements.forEach(h2 => {
                h2.style.textAlign = 'center';
            });
        })
        .catch(error => {
            console.error('Error loading work:', error);
            console.error('Failed path:', workPath);
            document.getElementById('work-content').innerHTML = `<p class="error">Error loading content: ${error.message}</p><p><a href="index.html">Return to Home</a></p>`;
        });
    }
});

// Global function to load work parts (for multi-part works)
window.loadWorkPart = function (path) {
    // Encode the path properly
    const pathParts = path.split('/');
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const encodedPath = encodedParts.join('/');
    console.log('Loading work part from:', encodedPath);
    console.log('Original path:', path);
    fetch(encodedPath)
        .then(response => {
            console.log('Response status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText} - Failed to load ${path}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract style tags from head to preserve original formatting
            const styleTags = doc.querySelectorAll('head style');
            let stylesHTML = '';
            styleTags.forEach(style => {
                stylesHTML += style.outerHTML;
            });

            // Get the body content
            let bodyContent = '';
            if (doc.body && doc.body.innerHTML.trim().length > 0) {
                bodyContent = doc.body.innerHTML;
            } else {
                bodyContent = html;
            }

            // Preserve original format by including styles and body content with back button
            const backButton = `<button onclick="location.reload()" class="btn btn-back-to-index">← Back to Index</button>`;
            document.getElementById('work-content').innerHTML = stylesHTML + backButton + bodyContent;

            // On desktop, wrap button and first h1 in a container for proper alignment
            if (window.innerWidth >= 769) {
                const workContent = document.getElementById('work-content');
                const button = workContent.querySelector('.btn-back-to-index');
                
                if (button) {
                    // Find the first h1 (might be directly after button or in a wrapper)
                    let firstH1 = button.nextElementSibling;
                    
                    // If next sibling is body/div, look inside it for h1
                    if (firstH1 && (firstH1.tagName === 'BODY' || firstH1.tagName === 'DIV')) {
                        firstH1 = firstH1.querySelector('h1:first-of-type');
                    } else if (firstH1 && firstH1.tagName !== 'H1') {
                        // Not h1, find first h1 in work content
                        firstH1 = workContent.querySelector('h1:first-of-type');
                    }
                    
                    if (firstH1 && firstH1.tagName === 'H1') {
                        // Create wrapper and move both elements
                        const wrapper = document.createElement('div');
                        wrapper.className = 'title-with-back-button';
                        workContent.insertBefore(wrapper, button);
                        wrapper.appendChild(button);
                        firstH1.parentNode.removeChild(firstH1);
                        wrapper.appendChild(firstH1);
                    }
                }
            }

            // Force center alignment on h1 titles after content loads (but not first one on desktop if it has a button)
            const h1Elements = document.querySelectorAll('#work-content h1, .work-content h1');
            h1Elements.forEach(h1 => {
                if (window.innerWidth < 769 || !h1.closest('.title-with-back-button')) {
                    h1.style.textAlign = 'center';
                }
            });
            
            // Force center alignment on h2 titles in work-index sections
            const indexH2Elements = document.querySelectorAll('#work-content .work-index h2, .work-content .work-index h2');
            indexH2Elements.forEach(h2 => {
                h2.style.textAlign = 'center';
            });

            // Scroll to top
            window.scrollTo(0, 0);
        })
        .catch(error => {
            console.error('Error loading part:', error);
            console.error('Failed path:', path);
            alert(`Error loading content: ${error.message}`);
        });
};

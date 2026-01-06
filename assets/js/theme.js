// Theme Toggle Functionality
(function() {
    'use strict';

    // Theme icons (sun for light mode, moon for dark mode)
    const LIGHT_ICON = '☀️';
    const DARK_ICON = '🌙';

    // Get saved theme or default to light
    function getSavedTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    // Save theme preference
    function saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    // Apply theme to document
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
        updateThemeIcon(theme);
    }

    // Update theme toggle button icon
    function updateThemeIcon(theme) {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.textContent = theme === 'dark' ? LIGHT_ICON : DARK_ICON;
            toggleButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            toggleButton.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
    }

    // Set up event listener when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            const toggleButton = document.getElementById('theme-toggle');
            if (toggleButton) {
                toggleButton.addEventListener('click', toggleTheme);
            }
        });
    } else {
        initTheme();
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleTheme);
        }
    }
})();










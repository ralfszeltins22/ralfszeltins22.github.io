document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchGitHubRepo(query);
        }
    });

    async function searchGitHubRepo(query) {
        const repoOwner = 'ralfszeltins22';
        const repoName = 'ralfszeltins22.github.io';
        const directoryPath = 'moviego/video';
        const token = 'GITHUBACCESSTOKEN'; // Replace with your personal access token
        const headers = {
            Authorization: `token ${token}`
        };
        const apiUrl = `https://api.github.com/search/code?q=${query}+in:path+repo:${repoOwner}/${repoName}+path:${directoryPath}`;

        try {
            const response = await fetch(apiUrl, {
                headers: headers
            });
            if (response.ok) {
                const data = await response.json();
                displayResults(data.items);
            } else {
                console.error('Error fetching data:', response.status, response.statusText);
                searchResults.innerHTML = '<p>Error fetching data from GitHub.</p>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            searchResults.innerHTML = '<p>Error fetching data from GitHub.</p>';
        }
    }

    function displayResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found.</p>';
            return;
        }

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result';
            resultItem.innerHTML = `
                <h3><a href="https://github.com/${result.repository.full_name}/blob/${result.path}" target="_blank">${result.path}</a></h3>
                <p>${result.repository.full_name}</p>
                <p>${result.html_url}</p>
            `;
            searchResults.appendChild(resultItem);
        });
    }
});

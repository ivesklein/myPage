import { marked } from 'marked';

window.addEventListener('load', () => {
    navigate(); // Handle initial load
    window.addEventListener('hashchange', navigate); // Handle hash change
});
    
async function navigate() {
    const hash = window.location.hash || '#home';
    const route = hash.split("#")
    const res = await getContentFromApi(route[1]??"home")
    document.getElementById('content').innerHTML = marked.parse(res.content);
    document.title = getFirstHeading(res.content)??"Page"
    renderRoute(route[1])
}

async function getContentFromApi(hash) {
    const url = `${API_ENDPOINT}/page/${hash}`;
    try {
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`); // Handle errors (404, 500, etc.)
        }

        const data = await response.json(); // Parse the JSON response
        return {
            content: data.content,
            createdAt: data.createdAt,
            id: data.id,
            updatedAt: data.updatedAt
        };

    } catch (error) {
        return {content: `# Error\n${error.message}`};
    }
}

function getFirstHeading(mdText) {
    const match = mdText.match(/^# (.+)$/m); // Match the first line starting with #
    return match ? match[1] : null; // Return the heading text or null if not found
}

function renderRoute(route) {
    const urlContainer = document.getElementById('url');
    
    // Split the route by "-"
    const parts = route.split('-');
    
    // Initialize an empty array to hold the path fragments
    let path = [];
    urlContainer.innerHTML = ''; // Clear any existing content
    
    parts.forEach((part, index) => {
        path.push(part); // Add the current part to the path array
        
        // Create a link element
        const link = document.createElement('a');
        link.href = `#${path.join('-')}`;
        link.textContent = part;
        
        // Append the link to the container
        urlContainer.appendChild(link);
        
        // If it's not the last part, add a separator
        if (index < parts.length - 1) {
            urlContainer.appendChild(document.createTextNode(' / '));
        }
    });
}

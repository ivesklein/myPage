import { marked } from 'marked';

window.addEventListener('load', () => {
    navigate(); // Handle initial load
    window.addEventListener('hashchange', navigate); // Handle hash change
});

document.getElementById('box-editor').oninput = function() {
    console.log("asd")
    handleTextareaChange(this.value);
};

document.getElementById('save').onclick = async function() {
    const button = document.getElementById('save');
    
    // Disable button
    button.disabled = true;

    // Add pulsing color effect
    button.classList.add('pulse');

    // Prepare data and headers
    const data = {
        id: document.getElementById('content').dataset.id,
        content: document.getElementById('box-editor').value
    };
    
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(API_ENDPOINT+"/page", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Blink green on success
            button.classList.remove('pulse');
            button.classList.add('success-blink');

            setTimeout(() => {
                button.classList.remove('success-blink');
            }, 1000);
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        console.error(error);
    } finally {
        // Re-enable the button after the effect ends
        setTimeout(() => {
            button.disabled = false;
            button.classList.remove('pulse');
        }, 1000);
    }
};


function handleTextareaChange(content){
    document.getElementById('content').innerHTML = marked.parse(content);
}


async function navigate() {
    const hash = window.location.hash || '#home';
    const route = hash.split("#")
    const res = await getContentFromS3(route[1]??"home")
    document.getElementById('content').dataset.id = route[1]??"home"
    document.getElementById('content').innerHTML = marked.parse(res.content);
    document.title = "EDITING - "+getFirstHeading(res.content)??"Page"
    document.getElementById('box-editor').value = res.content
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

async function getContentFromS3(hash) {
    const url = `${DOCS_ENDPOINT}/${hash}.md`;
    try {
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`); // Handle errors (404, 500, etc.)
        }

        const data = await response.text(); // Parse the JSON response
        return {
            content: data,
            id: hash,
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
        const link = document.createElement('span');
        link.textContent = part;
        
        // Append the link to the container
        urlContainer.appendChild(link);
        
        // If it's not the last part, add a separator
        if (index < parts.length - 1) {
            urlContainer.appendChild(document.createTextNode(' / '));
        }
    });
}

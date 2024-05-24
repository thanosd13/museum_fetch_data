let exhibitions = [];
let artworks = [];

async function fetchExhibitions() {
    try {
        const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Get JSON response
        if (data && Array.isArray(data.departments)) { 
            exhibitions = data.departments;
        } else {
            throw new Error('Exhibitions data is not in expected format');
        }
        updateHTMLexhibitions();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function updateHTMLexhibitions() {
    const list = document.getElementById('exhibitionList');
    list.innerHTML = ''; // Clear existing list items

    exhibitions.forEach(exhibition => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${exhibition.displayName}</strong>
        `;
        list.appendChild(listItem);
    });
}

async function fetchArtworks() {
    // Start and end IDs for the loop
    const startId = 45730;
    const endId = 45739;

    try {
        // Loop through each ID in the range
        for (let objectId = startId; objectId <= endId; objectId++) {
            const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for object ID ${objectId}`);
            }
            const data = await response.json();
            if (data) {
                artworks.push(data); // Add the fetched artwork data to the array
            } else {
                console.error('Failed to load data for object ID:', objectId);
            }
        }
        console.log("artworks array:", artworks);
        updateHTMLartworks();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function updateHTMLartworks() {
    const list = document.getElementById('artworksList');
    list.innerHTML = ''; // Clear the list initially

    artworks.forEach(artwork => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>creator:</strong> ${artwork.artistDisplayName}<br>
            <strong>title: </strong>${artwork.title}<br>
            <button>Show Image</button>
            <br><br>
            <img src="${artwork.additionalImages[0] || artwork.primaryImage}" alt="Artwork Image" style="display: none;">
        `;

        list.appendChild(listItem);

        // Get the last button and image added to the list
        const button = listItem.querySelector('button');
        const img = listItem.querySelector('img');

        // Toggle image display on button click
        button.onclick = function() {
            if (img.style.display === 'none') {
                img.style.display = 'block'; // Show image
            } else {
                img.style.display = 'none'; // Hide image
            }
        };
    });
}


function fetchDataOnLoad() {
    fetchExhibitions();
    fetchArtworks();
}
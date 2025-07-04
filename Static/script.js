// Define the backend URI (replace with your actual endpoint)
const BACKEND_URI = 'https://dgxbxbm4k3gbauc-api.lemondune-0dcbb7e4.westus2.azurecontainerapps.io';

function getHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

async function fetchData() {
    request = {
        prompt: 'What was the price of the product with sku `FR-R92B-58`?',
        session_id: "1234" // TODO: Need to generate a session id
    };
    try {
        const response = await fetch(`${BACKEND_URI}/ai`, {
            method: 'POST',
            headers: getHeaders(),
            mode: 'cors',
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data from backend:', data);
        // Process your data as needed
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call fetchData() when the page loads or as needed
fetchData();


const myVar = process.env.AZURE_STORAGE_CONTAINER_NAME;
console.log(`Value of MY_VAR is: ${myVar}`);
function sendMessage() {
    const strId = document.getElementById('strIdInput').value;
    const strUserQuestion = document.getElementById('strUserQuestion').value;
    const strConversationType = document.getElementById('conversationType').value; // Get selected conversation type
    const divMessages = document.getElementById('messages');

    console.log('sendMessage() function called ' + strUserQuestion ); 

    // Clear text area
    document.getElementById("strUserQuestion").value = '';

    // Display user's message
    divMessages.innerHTML += `<div class="user"> <b> User (${strId}): </b> </br> ${strUserQuestion.replace(/\n/g, '<br>')}</div>`;

    // Display loading indicator
    divMessages.innerHTML += '<div class="bot">Loading...</div>';

    // Make a POST request to Flask server
    fetch('/get_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'strId': strId,
            'strUserQuestion': strUserQuestion,
            'strConversationType': strConversationType, // Include conversationType
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('check this: ',data)
        // Remove loading indicator
        divMessages.removeChild(divMessages.lastChild);

        // Display bot's response with preserved line breaks and emojis
        const botResponseDiv = document.createElement('div');
        botResponseDiv.classList.add('bot');
        botResponseDiv.style.whiteSpace = 'pre-line';
        botResponseDiv.innerHTML = `<b>Bot:</b> ${data.strBotResponse}`;

        divMessages.appendChild(botResponseDiv);
    })
    .catch(error => console.error('Error:', error));

}


// Function to handle uploading files
function uploadFile() {
    const strId = document.getElementById('strIdInput').value;
    const fileInput = document.getElementById('fileInput');
    const divMessages = document.getElementById('files');
    const formData = new FormData();

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        // Get the selected file
        const selectedFile = fileInput.files[0];

        // Check if the file type is either CSV or TXT
        if (selectedFile.type === 'text/csv' || selectedFile.type === 'text/plain') {
            // Append file to FormData
            formData.append('file', selectedFile);
        } else {
            // Show an alert if the file type is not CSV or TXT
            alert('Please select a CSV or TXT file.');
            return;
        }
    } else {
        // Show an alert if no file is selected
        alert('Please select a file before uploading.');
        return;
    }

    // Append string data (strId) to FormData
    formData.append('strId', strId);

    // Display loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Uploading...';
    divMessages.appendChild(loadingIndicator);

    // Make a POST request to Flask server for file upload
    fetch('/upload_file', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Remove loading indicator
        divMessages.removeChild(loadingIndicator);

        // Display response
        divMessages.innerHTML += `<div>${data.message}</div>`;
    })
    .catch(error => {
        // Handle errors and remove loading indicator
        console.error('Error:', error);
        divMessages.removeChild(loadingIndicator);
    });
}
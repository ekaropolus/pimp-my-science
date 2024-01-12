document.addEventListener("DOMContentLoaded", function () {
    const chatContent = document.getElementById("chat-content");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const spinner = document.getElementById("spinner");

    sendButton.addEventListener("click", async () => {
        const message = messageInput.value;
        if (message) {
            try {
                // Show the Bootstrap spinner while waiting for the Hugging Face API response
                spinner.style.display = "block";

                // Make the API request using the "query" function for Hugging Face model
                const responseArray = await query({ "inputs": message });

                // Make a separate API request to fetch data from https://app.hadox.org/crm/api/scientists/
                const scientistsResponse = await fetch("https://app.hadox.org/crm/api/scientists/");
                let scientistsData;

                // Check if the response is valid JSON
                try {
                    // Replace "NaN" with null in the response text before parsing
                    const responseText = await scientistsResponse.text();
                    const sanitizedResponseText = responseText.replace(/NaN/g, 'null');
                    scientistsData = JSON.parse(sanitizedResponseText);
                } catch (error) {
                    console.error("Error parsing scientists API response as JSON:", error);
                    scientistsData = "Invalid JSON response from scientists API.";
                }

                // Hide the Bootstrap spinner when the API responses are received
                spinner.style.display = "none";

                if (Array.isArray(responseArray) && responseArray.length > 0) {
                    const serverResponse = responseArray[0].generated_text;

                    // Display user's message and Hugging Face model response in the chat
                    chatContent.innerHTML += `<div class="user-message text-bg-primary">${message}</div>`;
                    chatContent.innerHTML += `<div class="server-message">${serverResponse}</div>`;
                } else {
                    console.error("Hugging Face API response is empty or not in the expected format.");
                }

                // Display the scientists' response from the API
                if (Array.isArray(scientistsData)) {
                    scientistsData.forEach((scientist) => {
                        const {
                            CVU,
                            NIVEL,
                            NOMBRE_DEL_INVESTIGADOR,
                            DISCIPLINA,
                            SUBDISCIPLINA,
                            INSTITUCION_DE_ADSCRIPCION,
                            LINKEDIN_URL,
                        } = scientist;

                        // Create hyperlinks for CVU and LINKEDIN_URL
                        const cvuLink = CVU ? `<a href="${LINKEDIN_URL}" target="_blank">${CVU}</a>` : 'N/A';
                        const linkedinLink = LINKEDIN_URL ? `<a href="${LINKEDIN_URL}" target="_blank">${LINKEDIN_URL}</a>` : 'N/A';

                        // Display scientist information with hyperlinks
                        chatContent.innerHTML += `<div class="scientist-info">CVU: ${cvuLink}, NIVEL: ${NIVEL || 'N/A'}, NOMBRE: ${NOMBRE_DEL_INVESTIGADOR || 'N/A'}, DISCIPLINA: ${DISCIPLINA || 'N/A'}, SUBDISCIPLINA: ${SUBDISCIPLINA || 'N/A'}, INSTITUCION: ${INSTITUCION_DE_ADSCRIPCION || 'N/A'}, LINKEDIN: ${linkedinLink}</div>`;
                    });
                } else {
                    console.error("Scientists API response is not an array.");
                }
            } catch (error) {
                console.error("Error:", error);
            }

            // Clear the input field
            messageInput.value = "";
        }
    });

    function sendMessageToServer(message) {
        // Send the message to your server using fetch or another method
        // Handle the server's response and display it in the chat window
        // You can use the provided "query" function for interaction with the Hugging Face model
    }
});

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        {
            headers: {
                Authorization: "Bearer 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",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

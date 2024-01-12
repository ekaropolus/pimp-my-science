// chat.js
document.addEventListener("DOMContentLoaded", function () {
    const chatContent = document.getElementById("chat-content");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", () => {
        const message = messageInput.value;
        if (message) {
            // Display user's message in the chat
            chatContent.innerHTML += `<div class="user-message">${message}</div>`;

            // Clear the input field
            messageInput.value = "";

            // Send the message to the server and handle the response
            sendMessageToServer(message);
        }
    });

    function sendMessageToServer(message) {
        // Send the message to your server using fetch or another method
        // Handle the server's response and display it in the chat window
        // You can use the provided "query" function for interaction with the Hugging Face model
    }
});

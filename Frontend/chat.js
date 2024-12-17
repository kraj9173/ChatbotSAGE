function sendMessage() {
    const userInput = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const imageFrame = document.getElementById("imageFrame");

    if (imageFrame && !imageFrame.classList.contains("hidden")) {
        imageFrame.classList.add("hidden");
    }

    if (userInput.value.trim() !== "") {
        const userMessage = document.createElement("div");
        userMessage.className = "message user";
        userMessage.textContent = userInput.value;
        chatbox.appendChild(userMessage);

        chatbox.scrollTop = chatbox.scrollHeight;

        // Disable the user input field while waiting for the bot response
        userInput.disabled = true;

        // Call the Hugging Face API
        fetch("https://api-inference.huggingface.co/models/Adarsh-12/flan-t5-small-finetuned", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"  // Your Hugging Face API token
            },
            body: JSON.stringify({
                inputs: userInput.value,
                parameters: {
                    max_length: 10000, // Increase the maximum length of the response
                    temperature: 0.9, // Adjust creativity
                    top_p: 0.9       // Control diversity
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data); // Log the API response for debugging
            const botMessageContainer = document.createElement("div");
            botMessageContainer.className = "message bot-container";

            const botLogo = document.createElement("img");
            botLogo.className = "bot-logo";
            botLogo.src = "chat.jpeg";  // Change to your bot's logo if needed

            const botMessage = document.createElement("div");
            botMessage.className = "message-text";

            // Check and set the response text
            if (data && data[0] && data[0].generated_text) {
                botMessage.textContent = data[0].generated_text;
            } else {
                botMessage.textContent = "Sorry, I couldn't understand that.";
            }

            botMessageContainer.appendChild(botLogo);
            botMessageContainer.appendChild(botMessage);

            chatbox.appendChild(botMessageContainer);
            chatbox.scrollTop = chatbox.scrollHeight;

            // Re-enable the input field after receiving the bot's response
            userInput.disabled = false;
        })
        .catch(error => {
            console.error("Error:", error);
            const botMessageContainer = document.createElement("div");
            botMessageContainer.className = "message bot-container";

            const botLogo = document.createElement("img");
            botLogo.className = "bot-logo";
            botLogo.src = "chat.jpeg";

            const botMessage = document.createElement("div");
            botMessage.className = "message-text";
            botMessage.textContent = "Sorry, there was an issue with the request.";

            botMessageContainer.appendChild(botLogo);
            botMessageContainer.appendChild(botMessage);

            chatbox.appendChild(botMessageContainer);
            chatbox.scrollTop = chatbox.scrollHeight;

            userInput.disabled = false;
        });

        userInput.value = "";
    }
}

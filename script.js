/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Store chat history as an array of messages
let messages = [
  {
    role: "system",
    content:
      "Answer only questions related to L’Oréal products, recommendations, brand history, brand identity, and brand values. If a user asks about any other topic, politely and cheerfully redirect the conversation to L’Oréal-related subjects. Keep answers brief, providing no more detail than necessary. Maintain a conversational, human tone; never respond as if reading from search results or a database.",
  },
];

// Listen for form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user's message from the input box
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Add user's message to the messages array
  messages.push({ role: "user", content: userMessage });

  // Show user's message in the chat window with "You: " prefix
  chatWindow.innerHTML += `<div class="msg user"><b>You</b>: ${userMessage}</div>`;

  // Clear the input box
  userInput.value = "";

  // Show a loading message while waiting for the AI response
  chatWindow.innerHTML += `<div class="msg ai"><b>Assistant</b>: ...</div>`;

  try {
    const workerUrl = "https://nameless-morning-3fc6.griffing.workers.dev/";

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    // Parse the response as JSON
    const data = await response.json();

    // Check if the response has the expected structure
    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      // Show the error in the chat window for debugging
      chatWindow.innerHTML += `<div class="msg ai">Sorry, there was an error.<br>Details: ${JSON.stringify(
        data
      )}</div>`;
      console.error("Unexpected response format:", data);
      return;
    }

    // Get the assistant's reply
    const aiReply = data.choices[0].message.content;

    // Add assistant's reply to messages array
    messages.push({ role: "assistant", content: aiReply });

    // Remove loading message and show AI reply with "Assistant: " prefix
    const msgs = chatWindow.querySelectorAll(".msg.ai");
    if (msgs.length) msgs[msgs.length - 1].remove();

    chatWindow.innerHTML += `<div class="msg ai"><b>Assistant</b>: ${aiReply}</div>`;

    // Scroll chat window to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    chatWindow.innerHTML += `<div class="msg ai">Sorry, there was an error connecting to OpenAI.<br>${error}</div>`;
    console.error("Chat error:", error);
  }
});

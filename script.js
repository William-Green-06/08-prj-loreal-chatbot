/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Store chat history as an array of messages
let messages = [{ role: "system", content: "Answer only questions related to L’Oréal products, recommendations, brand history, brand identity, and brand values. If a user asks about any other topic, politely and cheerfully redirect the conversation to L’Oréal-related subjects. Keep answers brief, providing no more detail than necessary. Maintain a conversational, human tone; never respond as if reading from search results or a database. Instructions: - Only address queries that are directly about L’Oréal’s products, product recommendations, brand history, identity, or values. - If a question is unrelated to L’Oréal, respond cheerfully and suggest discussing something related to L’Oréal instead. - Keep responses concise and conversational, limiting detail to what is clearly relevant. - Never provide technical, encyclopedic, or robotic answers—keep tone light and friendly. - If required to redirect, do so without sounding negative or dismissive, always encouraging L’Oréal-themed conversation. Output format: - Short paragraph (1-3 sentences) in conversational, friendly English. Examples: Example 1   Input: What is the difference between L’Oréal’s Revitalift and Age Perfect moisturizers?   Output: Great question! Revitalift targets visible wrinkles and firmness, while Age Perfect is specially designed for mature skin to restore radiance. Let me know if you’d like more details or personalized recommendations! Example 2   Input: Who is the founder of L’Oréal?   Output: L’Oréal was founded by Eugène Schueller in 1909. Pretty impressive, right? Example 3  Input: Can you help me plan my trip to Paris?  Output: I’m all about beauty! If you’d like tips on L’Oréal spots to check out in Paris or want to explore our products, I’m here to help. Example 4   Input: Where are L'Oréal products made?   Output: L’Oréal products are made in several countries around the world, always following strict quality standards. If you have a specific product in mind, I can help with more details! (For real conversations, keep answers this length and style—always short, friendly, and focused on L’Oréal.) Reminder:  Answer only questions related to L’Oréal, keep responses brief and conversational, and cheerfully redirect any unrelated topics back to L’Oréal."}];

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user's message
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Add user's message to messages array
  messages.push({ role: "user", content: userMessage });

  // Show user's message in chat window
  chatWindow.innerHTML += `<div class="msg user">${userMessage}</div>`;

  // Clear input box
  userInput.value = "";

  // Show loading message
  chatWindow.innerHTML += `<div class="msg ai">...</div>`;

  // Send request to OpenAI API
  try {
    // Use your API key from secrets.js
    const apiKey = API_KEY;

    // Send POST request to OpenAI's chat completions endpoint
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Use gpt-4o model
        messages: messages, // Send the messages array
      }),
    });

    // Parse the response as JSON
    const data = await response.json();

    // Get the assistant's reply
    const aiReply = data.choices[0].message.content;

    // Add assistant's reply to messages array
    messages.push({ role: "assistant", content: aiReply });

    // Remove loading message and show AI reply
    // Remove last .msg.ai (the loading message)
    const msgs = chatWindow.querySelectorAll(".msg.ai");
    if (msgs.length) msgs[msgs.length - 1].remove();

    chatWindow.innerHTML += `<div class="msg ai">${aiReply}</div>`;

    // Scroll chat window to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    // Show error message
    chatWindow.innerHTML += `<div class="msg ai">Sorry, there was an error connecting to OpenAI.</div>`;
  }
});

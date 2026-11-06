import OpenAI from "openai";
import { autoResizeTextarea, checkEnvironment, setLoading } from "./utils.js";
checkEnvironment();

// Initialize an OpenAI client for your provider using env vars
const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
  dangerouslyAllowBrowser: true,
});

// Get UI elements
const giftForm = document.getElementById("gift-form");
const userInput = document.getElementById("user-input");
const outputContent = document.getElementById("output-content");

function start() {
  // Setup UI event listeners
  userInput.addEventListener("input", () => autoResizeTextarea(userInput));
  giftForm.addEventListener("submit", handleGiftRequest);
}

// Initialize messages array with system prompt
const messages = [
  {
    role: "system",
    content: `You are the Gift Genie!
    Make your gift suggestions thoughtful and practical.f
    Your response must be under 100 words. 
    Skip intros and conclusions. 
    Only output gift suggestions.`,
  },
];

async function handleGiftRequest(e) {
  // Prevent default form submission
  e.preventDefault();

  // Get user input, trim whitespace, exit if empty
  const userPrompt = userInput.value.trim();
  if (!userPrompt) return;

  // Set loading state
  setLoading(true);

  // Add user message to messages array
  messages.push({
    role: "user",
    content: userPrompt
  })

  try {
    // Send chat completions request
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages
    })

    // Extract thhe assistant's response
    const giftSuggestions = response.choices[0].message.content

    // Render response on the page
    outputContent.textContent = giftSuggestions

  } catch (error) {
    console.error(error)
    outputContent.textContent = 
    "Sorry, I can't access what I need right now. Please try again"
    
  } finally {
    // Clear loading state
    setLoading(false);
  }
}

start();

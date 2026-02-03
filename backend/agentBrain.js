/**
 * agentBrain.js — Groq-powered AI agent brain
 *
 * Responsibilities:
 *   • Generate trivia questions (+ correct answers)
 *   • Generate prediction scenarios
 *   • Generate strategy card decks
 *   • Score free-form player answers
 *   • Narrate arena events (flavor text for the dashboard)
 */
const Groq = require("groq-sdk");

const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-specdec";   // fast, free, strong enough

// ── generic JSON-only completion ────────────────────────────────────────────
async function askJSON(systemPrompt, userPrompt) {
  const res = await groq.chat.completions.create({
    model:    MODEL,
    messages: [
      { role: "system",  content: systemPrompt + "\n\nRespond ONLY with valid JSON. No markdown, no backticks, no explanations." },
      { role: "user",    content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens:  1024
  });

  const raw = res.choices[0].message.content.trim();
  // strip accidental ```json … ``` wrapping
  const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(clean);
}

// ── generic text completion ──────────────────────────────────────────────────
async function askText(systemPrompt, userPrompt) {
  const res = await groq.chat.completions.create({
    model:    MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt }
    ],
    temperature: 0.8,
    max_tokens:  256
  });
  return res.choices[0].message.content.trim();
}

// ── Trivia: generate N questions ─────────────────────────────────────────────
async function generateTriviaQuestions(topic, count = 3) {
  return await askJSON(
    "You are a crypto & blockchain trivia master. Generate interesting, challenging questions.",
    `Generate exactly ${count} trivia questions about "${topic}".
     Return JSON array: [{ "question": "...", "answer": "...", "options": ["A","B","C","D"], "answerIndex": 0 }]
     answerIndex is the index (0-3) of the correct option in the options array.`
  );
}

// ── Prediction: generate a scenario ─────────────────────────────────────────
async function generatePredictionScenario() {
  return await askJSON(
    "You are a crypto market analyst. Create engaging prediction scenarios.",
    `Generate one crypto prediction scenario.
     Return JSON: { "scenario": "short description", "question": "yes/no question", "options": ["Yes","No"], "resolveHint": "how to know the answer" }`
  );
}

// ── Strategy Cards: generate a deck for a duel ──────────────────────────────
async function generateCardDeck(playerCount = 2) {
  return await askJSON(
    "You are a game designer creating a simple card duel for a crypto arena.",
    `Generate a card duel game.
     Each player gets 5 cards. Each card has a name, attack power (1-10), and defense power (1-10).
     Return JSON: {
       "decks": [ [5 cards for player 1], [5 cards for player 2] ],
       "rules": "short rules text"
     }
     Card format: { "name": "...", "attack": N, "defense": N, "flavor": "one-line flavor text" }`
  );
}

// ── Score an answer against the correct one ─────────────────────────────────
async function scoreAnswer(question, correctAnswer, playerAnswer) {
  const result = await askJSON(
    "You are a fair and strict quiz judge. Score the player's answer.",
    `Question: ${question}
     Correct answer: ${correctAnswer}
     Player answer: ${playerAnswer}
     Return JSON: { "score": <0-100>, "feedback": "short feedback" }`
  );
  return result;
}

// ── Narrate an arena event ───────────────────────────────────────────────────
async function narrateEvent(arena, event) {
  return await askText(
    "You are an exciting esports commentator for a crypto gaming arena. Keep it under 2 sentences. Be hype.",
    `Arena: "${arena.title}" | Event: ${event}`
  );
}

module.exports = {
  generateTriviaQuestions,
  generatePredictionScenario,
  generateCardDeck,
  scoreAnswer,
  narrateEvent
};

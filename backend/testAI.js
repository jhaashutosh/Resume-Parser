const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a 50 words story about a magic backpack.";

async function run() {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

run();

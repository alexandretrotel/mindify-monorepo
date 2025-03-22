import { generateSummaries } from "@/ai-utils/generate-summaries";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/summaries", async (req, res) => {
  try {
    const response = await generateSummaries();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

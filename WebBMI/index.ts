import express from "express";
import { getBmi } from "./bmiCalculator";
import { getExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  try {
    if (!height || !weight) {
      throw new Error("not enough parameters !");
    }
    const results = getBmi({
      queryHeight: height as string,
      queryWeight: weight as string,
    });
    res.json(results);
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
      res.status(400).json({ error: errorMessage });
    }
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  try {
    if (!daily_exercises || !target) {
      throw new Error("parameters missing");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const results = getExercises(daily_exercises, target);
    res.json(results);
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
      res.status(400).json({ error: errorMessage });
    }
  }
});

const port = 3003;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//http://localhost:3003/bmi?height=180&weight=72

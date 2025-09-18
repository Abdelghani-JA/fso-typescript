//bmi = mass (kg) / height (m) power of 2

import { parseBmiArgs } from "./utils";
interface bmiQueryValues {
  queryHeight: string;
  queryWeight: string;
}
interface results {
  height: number;
  weight: number;
  bmi: string;
}

function calculateBmi(height: number, mass: number): string {
  const bmi: number = mass / (height / 100) ** 2;

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal weight";
  } else if (bmi >= 25 && bmi <= 29.9) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

export function getBmi({ queryHeight, queryWeight }: bmiQueryValues): results {
  const { height, mass } = parseBmiArgs(["", "", queryHeight, queryWeight]);
  const bmi = calculateBmi(height, mass);
  return {
    height,
    weight: mass,
    bmi,
  };
}

try {
  if (require.main === module) {
    const { height, mass } = parseBmiArgs(process.argv);
    console.log(calculateBmi(height, mass));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
    console.log(errorMessage);
  }
}

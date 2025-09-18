import { parseExercisesArgs } from "./utils";

interface results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: string | number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(days: number[], target: number): results {
  const periodLength: number = days.length;
  const trainingDays: number = days.filter((item) => item > 0).length;
  const totalHours: number = days.reduce((accumulator, current) => {
    return (accumulator += current);
  }, 0);
  const average: number = totalHours / periodLength;
  const success: boolean = average >= target;

  //--1---][---2---][---3-- rounding the ratingPoint to the range of 3 by 'averagePercentage'

  const averagePercentage: number = (average * 100) / target;
  const ratingPoint: number = (3 * averagePercentage) / 100;
  let ratingDescription: string;
  let rating: number | string = Math.round(ratingPoint);

  if (!success) {
    switch (rating) {
      case 0:
      case 1:
        ratingDescription = "bad";
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        ratingPoint < 1 ? (rating = 1) : (rating = ratingPoint.toFixed(1));
        break;
      case 2:
        ratingDescription = "You have to do some efforts";
        rating = ratingPoint.toFixed(1);
        break;
      default: //condition with ratingPoint < 3 => same as case 2
        ratingDescription = "not too bad but could be better";
        rating = ratingPoint.toFixed(1);
        break;
    }
  } else {
    rating = 3; //hours are met and above
    ratingDescription = "Just good";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}

export function getExercises(
  queryDays: string[],
  queryTarget: string
): results {
  const { days, target } = parseExercisesArgs([
    "",
    "",
    queryTarget,
    ...queryDays,
  ]);
  return calculateExercises(days, target);
}

try {
  if (require.main === module) {
    const { days, target } = parseExercisesArgs(process.argv);
    console.log(calculateExercises(days, target));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
    console.log(errorMessage);
  }
}

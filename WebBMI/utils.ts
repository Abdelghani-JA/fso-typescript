interface bmiValues {
  height: number;
  mass: number;
}

interface ExercisesArgs {
  days: number[];
  target: number;
}

export const parseBmiArgs = (args: string[]): bmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      mass: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const parseExercisesArgs = (args: string[]): ExercisesArgs => {
  if (args.length < 4) throw new Error("Not enough arguments");

  if (isNaN(Number(args[2]))) {
    throw new Error("malformatted parameters!");
  }
  const target: number = Number(args[2]);

  const justDays: string[] = args.slice(3, args.length);
  const days: number[] = justDays.map((day: string) => {
    if (isNaN(Number(day))) {
      throw new Error("malformatted parameters!");
    } else {
      return Number(day);
    }
  });
  return {
    days,
    target,
  };
};

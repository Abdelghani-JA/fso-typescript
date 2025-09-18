import type { CoursePart } from "./types";

const Header = ({ name }: { name: string }) => {
  return <h1>{name}</h1>;
};

const checkCourse = (_course: never) => {
  throw new Error("unvalid course");
};

const Part = ({ course }: { course: CoursePart }) => {
  return (
    <div>
      <p>
        <strong>{course.name}</strong> {course.exerciseCount}
      </p>
      {"description" in course && <p>{course.description}</p>}
      {"groupProjectCount" in course && (
        <p>Project Exercises : {course.groupProjectCount}</p>
      )}
      {"backgroundMaterial" in course && <p>{course.backgroundMaterial}</p>}
      {"requirements" in course && (
        <>
          requirements:
          {course.requirements.map((value) => (
            <span key={value}>{value}, </span>
          ))}
        </>
      )}
    </div>
  );
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return courseParts.map((course) => {
    switch (course.kind) {
      case "basic":
      case "group":
      case "background":
      case "special":
        return <Part course={course} key={course.name}></Part>;
      default:
        return checkCourse(course);
    }
  });
};

const Total = ({ total }: { total: number }) => {
  return <p>Number of exercises : {total} </p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </>
  );
};

export default App;

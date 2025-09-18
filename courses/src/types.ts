interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseExtended extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBase, CoursePartBaseExtended {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartBase, CoursePartBaseExtended {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartBase, CoursePartBaseExtended {
  requirements: string[];
  kind: "special";
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

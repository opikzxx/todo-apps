function gradingStudents(grades) {
  return grades.map((grade) => {
    if (grade < 38) {
      return grade;
    }

    const nextMultipleOfFive = Math.ceil(grade / 5) * 5;
    if (nextMultipleOfFive - grade < 3) {
      return nextMultipleOfFive;
    }

    return grade;
  });
}

const grades = [4, 73, 67, 38, 33];
const roundedGrades = gradingStudents(grades);
console.log(roundedGrades);

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) =>
  <p>Number of exercises {parts.reduce((accumulator, part) => accumulator + part.exercises, 0)}</p>

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) =>
  <>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </>


const Course = ({ courses }) =>
  <div>
    {courses.map(course => (
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    ))}
  </div>

export default Course
import Exercise from '../models/exercise'

type Exercises = Readonly<{
  add(exercise: Exercise): Promise<Exercise>
}>

const Exercises = 'Exercises'

export default Exercises

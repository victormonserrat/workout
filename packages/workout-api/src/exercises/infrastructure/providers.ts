import ExerciseViews from '../application/services/views'
import Exercises from '../domain/services/exercises'
import EventStoreExercises from './services/event-store-exercises'
import MongooseExerciseViews from './services/mongoose-views'

const exerciseProviders = [
  {
    provide: Exercises,
    useClass: EventStoreExercises,
  },
  {
    provide: ExerciseViews,
    useClass: MongooseExerciseViews,
  },
]

export default exerciseProviders

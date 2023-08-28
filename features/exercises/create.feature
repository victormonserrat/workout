@exercises
@application
@infrastructure
Feature: Create exercise

Scenario: Creating an exercise
    Given the exercise list currently looks as follows:
    | name  |
    | Squat |
    When I create the following exercise:
    | name     |
    | Deadlift |
    Then I should see the following exercise list:
    | name     |
    | Squat    |
    | Deadlift |

Scenario: Creating an invalid exercise
    When I create the following exercise:
    | name |
    |      |
    Then I should see the following error:
    | name                | code  |
    | InvalidExerciseName | blank |

Scenario: Creating an exercise with an already in use name
    Given the exercise list currently looks as follows:
    | name  |
    | Squat |
    When I create the following exercise:
    | name  |
    | Squat |
    Then I should see the following error:
    | name               | code      |
    | NotCreatedExercise | used_name |

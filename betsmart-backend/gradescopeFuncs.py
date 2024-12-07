from gradescopeapi.classes.connection import GSConnection

# Create connection and login
connection = GSConnection()
connection.login("mohammedamin@berkeley.edu", "Coolestprohor1723!!!")

# Fetch all courses
courses = connection.account.get_courses()
for course in courses["student"]:
    print(course)

# Get all assignments for a specific course
course_id = 719091  # Replace with your course ID
assignments = connection.account.get_assignments(course_id)

# Print grade details for each assignment
for assignment in assignments:
    print(f"Assignment: {assignment.name}")
    print(f"Grade: {assignment.grade}/{assignment.max_grade}")
    print(f"Status: {assignment.submissions_status}")
    print("----------")

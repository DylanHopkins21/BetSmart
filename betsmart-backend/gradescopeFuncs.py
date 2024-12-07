from gradescopeapi.classes.connection import GSConnection
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("PASSWORD")

connection = GSConnection()
connection.login("mohammedamin@berkeley.edu", password)
courses = connection.account.get_courses()

print("Courses:")
course_name = None

for role, role_courses in courses.items():
    print(f"\n{role.capitalize()} Courses:")
    for course_id, course in role_courses.items():
        print(f"Course ID: {course_id}, Course Name: {course.name}")
        if int(course_id) == 719091:
            course_name = course.name

if course_name:
    print(f"\nAssignments for Course: {course_name}")
else:
    print("\nAssignments for Course ID 719091 (Course Name not found)")

course_id = 719091  
assignments = connection.account.get_assignments(course_id)

# Print assignments
for assignment in assignments:
    print(f"Assignment: {assignment.name}")
    print(f"Grade: {assignment.grade}/{assignment.max_grade}")
    print(f"Status: {assignment.submissions_status}")
    print("----------")

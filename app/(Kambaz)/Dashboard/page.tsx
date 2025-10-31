/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
} from "../Courses/[cid]/reducer";
import {
  enrollInCourse,
  unenrollFromCourse,
} from "../Enrollments/reducer";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";


export default function Dashboard() {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });
  
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // Get user's enrolled courses
  const userEnrollments = enrollments.filter((enrollment: any) => 
    enrollment.user === currentUser?._id
  );
  
  const enrolledCourseIds = userEnrollments.map((enrollment: any) => enrollment.course);
  
  // Filter courses based on whether we're showing all courses or just enrolled ones
  const displayedCourses = showAllCourses 
    ? courses 
    : courses.filter((course: any) => enrolledCourseIds.includes(course._id));
    
  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds.includes(courseId);
  };
  
  // Handle enrollment/unenrollment
  const handleEnrollment = (courseId: string) => {
    if (currentUser) {
      if (isEnrolled(courseId)) {
        dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
      } else {
        dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
      }
    }
  };

  return (
    <html>
      <body>
        <div id="wd-dashboard">
          <h1 id="wd-dashboard-title">
            Dashboard
            <Button 
              variant="primary" 
              className="float-end"
              onClick={() => setShowAllCourses(!showAllCourses)}
            >
              {showAllCourses ? "My Courses" : "All Courses"}
            </Button>
          </h1> 
          <hr />
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => dispatch(addNewCourse(course))}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse(course))}
              id="wd-update-course-click"
            >
              Update{" "}
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            placeholder="Course Name"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            className="mb-2"
            placeholder="Course Description"
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
          <h2 id="wd-dashboard-published">
            {showAllCourses ? `All Courses (${courses.length})` : `My Courses (${displayedCourses.length})`}
          </h2>{" "}
          <hr />
          <div id="wd-dashboard-courses">
            <Row xs={1} md={5} className="g-4">
              {displayedCourses.map((course: any) => (
                <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                  <Card>
                    <CardImg
                      src="/images/reactjs.jpg"
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}{" "}
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}{" "}
                      </CardText>
                      
                      {/* Course navigation - only for enrolled users */}
                      {isEnrolled(course._id) && (
                        <Link href={`/Courses/${course._id}/Home`}>
                          <Button variant="primary">Go</Button>
                        </Link>
                      )}
                      
                      {/* Faculty controls - only for faculty */}
                      {currentUser?.role === "FACULTY" && (
                        <>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(course._id));
                            }}
                            className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                          <button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end"
                          >
                            Edit
                          </button>
                        </>
                      )}
                      
                      {/* Enrollment controls - for students */}
                      {currentUser && currentUser.role !== "FACULTY" && (
                        <Button
                          variant={isEnrolled(course._id) ? "danger" : "success"}
                          className="float-end"
                          onClick={() => handleEnrollment(course._id)}
                        >
                          {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                        </Button>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </body>
    </html>
  );
}

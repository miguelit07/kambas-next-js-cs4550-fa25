/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setCourses,
} from "../Courses/[cid]/reducer";
import { setEnrollments } from "../Enrollments/reducer";
import * as client from "../Courses/client";
import * as enrollmentsClient from "../Enrollments/client";
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

  const isStudent = currentUser?.role === "STUDENT";
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let courses;
        
        if (!currentUser) {
          // Not logged in - show all courses for browsing
          courses = await client.findAllCourses();
        } else if (showAllCourses || isStudent) {
          // Students browsing for enrollment OR explicit show all
          courses = await client.findAllCourses();
        } else if (isFaculty) {
          // Faculty - show only their created courses
          courses = await client.findMyCourses();
        } else {
          // Default fallback
          courses = await client.findMyCourses();
        }
        
        dispatch(setCourses(courses));
      } catch (error: any) {
        console.error("Failed to fetch courses:", error);
        // If authentication fails, fall back to showing all courses
        if (error?.response?.status === 401) {
          try {
            const allCourses = await client.findAllCourses();
            dispatch(setCourses(allCourses));
          } catch (fallbackError) {
            console.error("Failed to fetch all courses:", fallbackError);
          }
        }
      }
    };
    
    fetchCourses();
  }, [currentUser, showAllCourses, dispatch, isFaculty, isStudent]);

  // Fetch enrollments for the current user
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser) {
        try {
          const enrollments = await enrollmentsClient.findMyEnrollments();
          dispatch(setEnrollments(enrollments));
        } catch (error) {
          console.error("Failed to fetch enrollments:", error);
        }
      } else {
        dispatch(setEnrollments([]));
      }
    };
    
    fetchEnrollments();
  }, [currentUser, dispatch]);

  // Get user's enrolled courses
  const enrolledCourseIds = enrollments.map(
    (enrollment: any) => enrollment.course?._id || enrollment.course
  );

  // Debug logging
  console.log("Dashboard Debug:", {
    currentUser: currentUser?._id,
    enrollments,
    enrolledCourseIds
  });

  // Since server already filters courses based on showAllCourses, we can use courses directly
  const displayedCourses = courses;

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds.includes(courseId);
  };

  // Handle enrollment/unenrollment
  const handleEnrollment = async (courseId: string) => {
    if (currentUser) {
      try {
        if (isEnrolled(courseId)) {
          await enrollmentsClient.unenrollFromCourse(courseId);
        } else {
          await enrollmentsClient.enrollInCourse(courseId);
        }
        // Refresh enrollments after successful operation
        const updatedEnrollments = await enrollmentsClient.findMyEnrollments();
        dispatch(setEnrollments(updatedEnrollments));
      } catch (error: any) {
        console.error("Failed to update enrollment:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        alert(`Enrollment failed: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  const onAddNewCourse = async () => {
    if (!currentUser) {
      console.error("User must be authenticated to create courses");
      return;
    }
    try {
      const newCourse = await client.createCourse(course);
      dispatch(setCourses([...courses, newCourse]));
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    if (!currentUser) {
      console.error("User must be authenticated to delete courses");
      return;
    }
    try {
      await client.deleteCourse(courseId);
      dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const onUpdateCourse = async () => {
    if (!currentUser) {
      console.error("User must be authenticated to update courses");
      return;
    }
    try {
      await client.updateCourse(course);
      dispatch(setCourses(courses.map((c: any) => {
        if (c._id === course._id) { return course; }
        else { return c; }
      })));
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <Button
          variant="primary"
          className="float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
          disabled={!currentUser}
        >
          {!currentUser ? "All Courses" : (
            isStudent ? (showAllCourses ? "Enrolled Courses" : "Browse Courses") :
            (showAllCourses ? "My Courses" : "All Courses")
          )}
        </Button>
      </h1>
      <hr />
      
      {/* Course creation form - only show to Faculty/Admin */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
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
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        {!currentUser || showAllCourses
          ? `All Courses (${courses.length})`
          : `My Courses (${displayedCourses.length})`}
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course: any) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
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

                  {/* Course navigation - for enrolled users and faculty */}
                  {(isEnrolled(course._id) || isFaculty) && (
                    <Link href={`/Courses/${course._id}/Home`}>
                      <Button variant="primary">Go</Button>
                    </Link>
                  )}

                  {/* Faculty controls - only for faculty */}
                  {isFaculty && (
                    <>
                      <button
                        className="btn btn-danger float-end"
                        onClick={(event) => {
                          event.preventDefault();
                          onDeleteCourse(course._id);
                        }}
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

                  {/* Enrollment controls - for students and other non-faculty users */}
                  {currentUser && !isFaculty && (
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
  );
}

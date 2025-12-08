/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";
import { useParams } from "next/navigation";

export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const params = useParams();
  const router = useRouter();
  const cid = params.cid as string;
  const course = courses.find((course) => course._id === cid);
  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  
  const isEnrolled = enrollments.some((enrollment: any) => 
    enrollment.user === currentUser?._id && (enrollment.course?._id === cid || enrollment.course === cid)
  );
  
  // Debug logging
  console.log("Course Layout Debug:", {
    currentUser: currentUser?._id,
    cid,
    enrollments,
    isEnrolled,
    isFaculty: currentUser?.role === "FACULTY"
  });
  
  useEffect(() => {
    if (currentUser && currentUser.role !== "FACULTY" && !isEnrolled) {
      console.log("Redirecting to Dashboard - not enrolled");
      router.push("/Dashboard");
    }
  }, [currentUser, isEnrolled, router]);
  
  if (currentUser && currentUser.role !== "FACULTY" && !isEnrolled) {
    return (
      <div className="text-center p-4">
        <h3>Access Denied</h3>
        <p>You must be enrolled in this course to access its content.</p>
        <p>Redirecting to Dashboard...</p>
      </div>
    );
  }
  
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}

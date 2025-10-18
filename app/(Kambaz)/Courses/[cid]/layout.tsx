"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";
import { usePathname, useParams } from "next/navigation";

export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const params = useParams();
  const cid = params.cid as string;
  const course = courses.find((course) => course._id === cid);
  const pathname = usePathname();
  
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course?.number} &gt; {pathname.split("/").pop()} 
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

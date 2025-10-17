"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
<<<<<<< Updated upstream

export default async function CoursesLayout(
  { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>
) {
  const { cid } = await params; // Await the params

  return (
    <div id="wd-courses">
      <h2>Courses {cid}</h2>
=======
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
>>>>>>> Stashed changes
      <hr />
      <table>
        <tbody>
          <tr>
            <td valign="top" width="200">
              <CourseNavigation />
            </td>
            <td valign="top" width="100%">
              {children}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
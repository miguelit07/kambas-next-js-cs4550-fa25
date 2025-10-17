"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CourseNavigation() {
  const params = useParams();
  const cid = params.cid as string;
  
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
<<<<<<< Updated upstream
    <div id="wd-courses-navigation">
      <Link href="/Courses/1234/Home" id="wd-course-home-link">
        Home
      </Link>
      <br />
      <Link href="/Courses/1234/Modules" id="wd-course-modules-link">
        Modules
      </Link>
      <br />
      <Link href="/Courses/1234/Piazza" id="wd-course-piazza-link">
        Piazza
      </Link>
      <br />
      <Link href="/Courses/1234/Zoom" id="wd-course-zoom-link">
        Zoom
      </Link>
      <br />
      <Link href="/Courses/1234/Assignments" id="wd-course-assignments-link">
        Assignments
      </Link>
      <br />
      <Link href="/Courses/1234/Quizzes" id="wd-course-quizzes-link">
        Quizzes
      </Link>
      <br />
      <Link href="/Courses/1234/Grades" id="wd-course-grades-link">
        Grades
      </Link>
      <br />
      <Link href="/Courses/1234/People/Table" id="wd-course-people-link">
        People
      </Link>
      <br />
=======
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const href = link === "People" 
          ? `/Courses/${cid}/People/Table` 
          : `/Courses/${cid}/${link}`;
        const isActive = link === "Home"; // Home is active by default
        const id = `wd-course-${link.toLowerCase()}-link`;
        
        return (
          <Link 
            key={link}
            href={href} 
            id={id} 
            className={`list-group-item border-0 ${isActive ? 'active' : ''}`}
          >
            {link}
          </Link>
        );
      })}
>>>>>>> Stashed changes
    </div>
  );
}

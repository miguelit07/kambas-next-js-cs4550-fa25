"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CourseNavigation() {
  const params = useParams();
  const cid = params.cid as string;
  
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
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
    </div>
  );
}

"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsBook, BsGripVertical } from "react-icons/bs";
import ModulesControlsButton from "../Modules/ModulesControlsButton";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { assignments } from "../../../Database";

interface Assignment {
  _id: string;
  title: string;
  course: string;
}

export default function Assignments() {
  const params = useParams();
  const cid = params.cid as string;
  
  // Filter assignments for the current course
  const courseAssignments = (assignments as Assignment[]).filter((assignment) => assignment.course === cid);

  return (
    <div>
      {/* <AssignmentsButtonControls /> */}
      <br />
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS{" "}
            <ModulesControlsButton />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {courseAssignments.map((assignment, index) => (
              <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
                <div>
                  <BsGripVertical className="me-2 fs-3" />{" "}
                  <BsBook className="me-2 fs-3" />
                  <Link
                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                    className="wd-assignment-link"
                  >
                    {assignment.title}
                  </Link>{" "}
                  <LessonControlButtons />
                  <div className="small text-muted mt-1 ps-5">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <b>Not available until </b>May {6 + index * 7} at 12:00am | Due May {13 + index * 7} at
                    11:59pm | 100 pts
                  </div>
                </div>
              </ListGroupItem>
            ))}
            
            {/* Show a message if no assignments found for this course */}
            {courseAssignments.length === 0 && (
              <ListGroupItem className="wd-lesson p-3 text-center text-muted">
                No assignments found for this course.
              </ListGroupItem>
            )}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
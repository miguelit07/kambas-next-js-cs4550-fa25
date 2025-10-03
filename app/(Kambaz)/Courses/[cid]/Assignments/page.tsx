import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "../Modules/ModulesControls";
import { BsBook, BsGripVertical } from "react-icons/bs";
import ModulesControlsButton from "../Modules/ModulesControlsButton";
import LessonControlButtons from "../Modules/LessonControlButtons";
import AssignmentsButtonControls from "./AssignmentsButtonControls";

export default function Assignments() {
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
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <div>
                <BsGripVertical className="me-2 fs-3" />{" "}
                <BsBook className="me-2 fs-3" />
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="wd-assignment-link"
                >
                  A1
                </Link>{" "}
                <LessonControlButtons />
                <div className="small text-muted mt-1 ps-5">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available until </b>May 6 at 12:00am | Due May 13 at
                  11:59pm | 100 pts
                </div>
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <div>
                <BsGripVertical className="me-2 fs-3" />{" "}
                <BsBook className="me-2 fs-3" />
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="wd-assignment-link"
                >
                  A2
                </Link>{" "}
                <LessonControlButtons />
                <div className="small text-muted mt-1 ps-5">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available until </b>May 13 at 12:00am | Due May 20 at
                  11:59pm | 100 pts
                </div>
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <div>
                <BsGripVertical className="me-2 fs-3" />{" "}
                <BsBook className="me-2 fs-3" />
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="wd-assignment-link"
                >
                  A3
                </Link>{" "}
                <LessonControlButtons />
                <div className="small text-muted mt-1 ps-5">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available until </b>May 20 at 12:00am | Due May 27 at
                  11:59pm | 100 pts
                </div>
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
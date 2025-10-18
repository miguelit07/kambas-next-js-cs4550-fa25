"use client"
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "next/navigation";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModulesControlsButton from "./ModulesControlsButton";
import LessonControlButtons from "./LessonControlButtons";
import { modules } from "../../../Database";

interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

interface Module {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
}

export default function Modules() {
  const params = useParams();
  const cid = params.cid as string;
  
  // Filter modules for the current course
  const courseModules = (modules as Module[]).filter((module) => module.course === cid);

  return (
    <div>
      <ModulesControls />
      <br />
      <br />
      <br />
      <br />
      <ListGroup className="rounded-0" id="wd-modules">
        {courseModules.map((module) => (
          <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary"> 
              <BsGripVertical className="me-2 fs-3" /> 
              {module.name} 
              <ModulesControlsButton />
            </div>
            {module.lessons && module.lessons.length > 0 && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson) => (
                  <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> 
                    {lesson.name}
                    <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
        
        {/* Show a message if no modules found for this course */}
        {courseModules.length === 0 && (
          <ListGroupItem className="wd-module p-3 text-center text-muted">
            No modules found for this course.
          </ListGroupItem>
        )}
      </ListGroup>
    </div>
  );
}

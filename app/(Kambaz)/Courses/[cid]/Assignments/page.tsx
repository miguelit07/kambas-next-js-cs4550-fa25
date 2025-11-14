"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsBook, BsGripVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "./reducer";
import { useEffect } from "react";
import * as client from "../../../Assignments/client";

interface Assignment {
  _id: string;
  title: string;
  course: string;
}

export default function Assignments() {
  const params = useParams();
  const cid = params.cid as string;
  const dispatch = useDispatch();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  
  useEffect(() => {
    const fetchAssignments = async () => {
      const assignments = await client.findAssignmentsForCourse(cid);
      dispatch(setAssignments(assignments));
    };
    fetchAssignments();
  }, [cid, dispatch]);

  const onDeleteAssignment = async (assignmentId: string) => {
    await client.deleteAssignment(assignmentId);
    dispatch(setAssignments(assignments.filter((a: Assignment) => a._id !== assignmentId)));
  };
  
  // No need to filter assignments since they're already filtered server-side
  const courseAssignments = assignments;

  return (
    <div>
      {/* Assignment Controls */}
      <div className="d-flex justify-content-end mb-3">
        <Link
          href={`/Courses/${cid}/Assignments/new`}
          className="btn btn-danger me-2"
        >
          <FaPlus className="me-1" />
          Assignment
        </Link>
      </div>
      
      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS{" "}
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {courseAssignments.map((assignment: Assignment, index: number) => (
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
                  <AssignmentControlButtons 
                    assignmentId={assignment._id}
                    deleteAssignment={(assignmentId) => {
                      onDeleteAssignment(assignmentId);
                    }}
                  />
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
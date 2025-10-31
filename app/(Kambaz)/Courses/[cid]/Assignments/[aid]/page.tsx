"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFromDate?: string;
  availableUntilDate?: string;
}

export default function AssignmentEditor() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const cid = params.cid as string;
  const aid = params.aid as string;
  
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  
  // Check if this is a new assignment
  const isNewAssignment = aid === "new";
  
  // Find the specific assignment if editing
  const existingAssignment = !isNewAssignment 
    ? assignments.find((a: Assignment) => a._id === aid && a.course === cid)
    : null;

  // Local state for the assignment form
  const [assignment, setAssignment] = useState<Assignment>({
    _id: "",
    title: "",
    course: cid,
    description: "",
    points: 100,
    dueDate: "",
    availableFromDate: "",
    availableUntilDate: "",
  });

  // Initialize form with existing assignment data or defaults
  useEffect(() => {
    if (existingAssignment) {
      setAssignment(existingAssignment);
    } else if (isNewAssignment) {
      setAssignment({
        _id: uuidv4(),
        title: "New Assignment",
        course: cid,
        description: "",
        points: 100,
        dueDate: "",
        availableFromDate: "",
        availableUntilDate: "",
      });
    }
  }, [existingAssignment, isNewAssignment, cid]);
  
  // Navigation function to go back to assignments
  const navigateToAssignments = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  // Save assignment
  const saveAssignment = () => {
    if (isNewAssignment) {
      dispatch(addAssignment(assignment));
    } else {
      dispatch(updateAssignment(assignment));
    }
    navigateToAssignments();
  };
  
  if (!isNewAssignment && !existingAssignment) {
    return (
      <div className="p-4">
        <h3>Assignment Not Found</h3>
        <p>The assignment with ID &quot;{aid}&quot; was not found in course &quot;{cid}&quot;.</p>
      </div>
    );
  }

  return (
    <div
      id="wd-assignments-editor"
      className="p-4"
      style={{ paddingLeft: "75px", maxWidth: "700px" }}
    >
      {/* Assignment Name */}
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input 
          id="wd-name" 
          value={assignment.title} 
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          className="form-control" 
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <textarea
          id="wd-description"
          value={assignment.description}
          onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          className="form-control"
          rows={5}
        />
      </div>

      {/* Points */}
      <div className="mb-3">
        <label htmlFor="wd-points" className="form-label">
          Points
        </label>
        <input 
          id="wd-points" 
          type="number"
          value={assignment.points} 
          onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
          className="form-control" 
        />
      </div>

      {/* Assignment Group */}
      <div className="mb-3">
        <label htmlFor="wd-group" className="form-label">
          Assignment Group
        </label>
        <select id="wd-group" className="form-select">
          <option value="assignments">ASSIGNMENTS</option>
          <option value="quizzes">QUIZZES</option>
          <option value="labs">LABS</option>
          <option value="exams">EXAMS</option>
        </select>
      </div>

      {/* Display Grade As */}
      <div className="mb-3">
        <label htmlFor="wd-display-grade-as" className="form-label">
          Display Grade as
        </label>
        <select id="wd-display-grade-as" className="form-select">
          <option value="percentage">Percentage</option>
          <option value="points">Points</option>
          <option value="complete">Complete/Incomplete</option>
        </select>
      </div>

      {/* Submission Type */}
      <div className="mb-3">
        <label htmlFor="wd-submission-type" className="form-label">
          Submission Type
        </label>
        <select id="wd-submission-type" className="form-select">
          <option value="online">Online</option>
          <option value="inperson">In Person</option>
        </select>

        {/* Online Entry Options */}
        <div className="mt-2 ms-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-website-url"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="wd-website-url">
              Website URL
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-media-recordings"
            />
            <label className="form-check-label" htmlFor="wd-media-recordings">
              Media Recordings
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-student-annotation"
            />
            <label className="form-check-label" htmlFor="wd-student-annotation">
              Student Annotation
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="wd-file-uploads"
            />
            <label className="form-check-label" htmlFor="wd-file-uploads">
              File Uploads
            </label>
          </div>
        </div>
      </div>

      {/* Assign To */}
      <div className="mb-3">
        <label htmlFor="wd-assign-to" className="form-label">
          Assign to
        </label>
        <input id="wd-assign-to" defaultValue="Everyone" className="form-control" />
      </div>

      {/* Dates */}
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="wd-due-date" className="form-label">
              Due
            </label>
            <input
              type="datetime-local"
              id="wd-due-date"
              value={assignment.dueDate}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="wd-available-from" className="form-label">
              Available From
            </label>
            <input
              type="datetime-local"
              id="wd-available-from"
              value={assignment.availableFromDate}
              onChange={(e) => setAssignment({ ...assignment, availableFromDate: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="wd-available-until" className="form-label">
              Until
            </label>
            <input
              type="datetime-local"
              id="wd-available-until"
              value={assignment.availableUntilDate}
              onChange={(e) => setAssignment({ ...assignment, availableUntilDate: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2">
        <button 
          id="cancel-btn" 
          type="button" 
          className="btn btn-light"
          onClick={navigateToAssignments}
        >
          Cancel
        </button>
        <button 
          id="submit-btn" 
          type="button" 
          className="btn btn-danger"
          onClick={saveAssignment}
        >
          Save
        </button>
      </div>
    </div>
  );
}

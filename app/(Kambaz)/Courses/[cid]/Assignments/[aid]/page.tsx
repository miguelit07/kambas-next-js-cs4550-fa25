export default function AssignmentEditor() {
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
        <input id="wd-name" defaultValue="A1" className="form-control" />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <textarea
          id="wd-description"
          defaultValue="The assignment is available online. Submit a link to the landing page..."
          className="form-control"
          rows={5}
        />
      </div>

      {/* Points */}
      <div className="mb-3">
        <label htmlFor="wd-points" className="form-label">
          Points
        </label>
        <input id="wd-points" defaultValue={100} className="form-control" />
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
              id="wd-text-entry"
            />
            <label className="form-check-label" htmlFor="wd-text-entry">
              Text Entry
            </label>
          </div>
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

      {/* Assign to */}
      <div className="card p-3 mb-3">
        <div className="mb-3">
          <label htmlFor="wd-assign-to" className="form-label">
            Assign to
          </label>
          <input
            id="wd-assign-to"
            defaultValue="Everyone"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="wd-due-date" className="form-label">
            Due
          </label>
          <input
            type="datetime-local"
            id="wd-due-date"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="wd-available-from" className="form-label">
            Available From
          </label>
          <input
            type="datetime-local"
            id="wd-available-from"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="wd-available-until" className="form-label">
            Until
          </label>
          <input
            type="datetime-local"
            id="wd-available-until"
            className="form-control"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2">
        <button id="cancel-btn" type="button" className="btn btn-light">
          Cancel
        </button>
        <button id="submit-btn" type="button" className="btn btn-danger">
          Save
        </button>
      </div>
    </div>
  );
}

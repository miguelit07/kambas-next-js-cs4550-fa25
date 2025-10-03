import { Button, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
export default function AssignmentsButtonControls() {
  return (
    <div id="wd-modules-controls" className="d-flex align-items-center gap-3">
      <div className="flex-grow-1">
        <InputGroup>
          <input
            type="search"
            className="form-control"
            placeholder="Search..."
            aria-label="Search assignments"
            id="wd-search-assignments"
          />
        </InputGroup>
      </div>

      <div className="d-flex align-items-center">
        <Button
          variant="secondary"
          size="lg"
          className="me-2"
          id="wd-add-module-btn"
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Asssignment
        </Button>
        <Button variant="danger" size="lg" id="wd-add-module-btn-2">
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Asssignment
        </Button>
      </div>
    </div>
  );
}

import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";

export default function AssignmentControlButtons({
  assignmentId,
  deleteAssignment,
}: {
  assignmentId: string;
  deleteAssignment: (assignmentId: string) => void;
}) {
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to remove this assignment?");
    if (confirmDelete) {
      deleteAssignment(assignmentId);
    }
  };

  return (
    <div className="float-end">
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={handleDelete}
        style={{ cursor: "pointer" }}
        title="Delete Assignment"
      />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
import { FaTrash, FaEdit, FaCopy } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";

interface Quiz {
  _id: string;
  title: string;
  published: boolean;
}

export default function QuizControlButtons({
  quiz,
  onDelete,
  onPublishToggle,
}: {
  quiz: Quiz;
  onDelete: () => void;
  onPublishToggle: () => void;
}) {
  const { cid } = useParams();

  return (
    <Dropdown>
      <Dropdown.Toggle 
        variant="light" 
        size="sm" 
        className="border-0"
        id={`quiz-dropdown-${quiz._id}`}
      >
        <IoEllipsisVertical />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as={Link} href={`/Courses/${cid}/Quizzes/${quiz._id}/editor`}>
          <FaEdit className="me-2" />
          Edit
        </Dropdown.Item>
        
        <Dropdown.Item onClick={onPublishToggle}>
          {quiz.published ? '❌ Unpublish' : '✅ Publish'}
        </Dropdown.Item>
        
        <Dropdown.Item onClick={() => {
          // Copy functionality - could navigate to a copy form
          alert('Copy functionality would be implemented here');
        }}>
          <FaCopy className="me-2" />
          Copy
        </Dropdown.Item>
        
        <Dropdown.Divider />
        
        <Dropdown.Item 
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
              onDelete();
            }
          }}
          className="text-danger"
        >
          <FaTrash className="me-2" />
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { useParams } from "next/navigation";
import Link from "next/link";

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
    <span className="float-end">
      {/* Publish/Unpublish Toggle */}
      <button
        className={`btn btn-sm me-2 ${quiz.published ? 'btn-success' : 'btn-secondary'}`}
        onClick={(e) => {
          e.preventDefault();
          onPublishToggle();
        }}
        title={quiz.published ? 'Unpublish Quiz' : 'Publish Quiz'}
      >
        {quiz.published ? 'Published' : 'Unpublished'}
      </button>

      {/* Edit Button */}
      <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/editor`} className="btn btn-sm btn-warning me-2">
        <FaEdit />
      </Link>

      {/* Delete Button */}
      <button
        className="btn btn-sm btn-danger me-2"
        onClick={(e) => {
          e.preventDefault();
          if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
            onDelete();
          }
        }}
      >
        <FaTrash />
      </button>

      {/* More Options */}
      <button className="btn btn-sm btn-light">
        <IoEllipsisVertical />
      </button>
    </span>
  );
}
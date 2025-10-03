import { BsPlus, BsPlusCircle } from "react-icons/bs";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
export default function GreenCheckmark() {
  return (
    <div className="float-end">
      <span className="me-1 position-relative">
        <FaCheckCircle
          style={{ top: "2px" }}
          className="text-success me-1 position-absolute fs-5"
        />
        <FaCircle className="text-white me-1 fs-6" />
        <BsPlus className="fs-4" />
        <IoEllipsisVertical className="fs-4" />
      </span>
    </div>
  );
}

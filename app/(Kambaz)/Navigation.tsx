import {
  AiOutlineBook,
  AiOutlineCalendar,
  AiOutlineCodepen,
  AiOutlineDashboard,
  AiOutlineHighlight,
  AiOutlineInbox,
  AiOutlineStar,
} from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
export default function KambazNavigation() {
  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 110, backgroundColor: "black" }}
      id="wd-kambaz-navigation"
    >
      <ListGroupItem
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>

      <ListGroupItem className="sidebar-item">
        <Link
          href="/Account"
          id="wd-account-link"
          className="text-white text-decoration-none"
        >
          <FaRegCircleUser color="white" className="fs-1 text-white" />
          <br />
          Account
        </Link>
      </ListGroupItem>
      <ListGroupItem className="sidebar-item">
        <Link
          href="/Dashboard"
          id="wd-dashboard-link"
          className="text-danger text-decoration-none"
        >
          <AiOutlineDashboard color="red" className="fs-1 text-danger" />
          <br />
          Dashboard
        </Link>
      </ListGroupItem>

      <ListGroupItem className="sidebar-item">
        <Link
          href="/Dashboard"
          id="wd-courses-link"
          className="text-danger text-decoration-none"
        >
          <AiOutlineBook color="red" className="fs-1 text-danger" />
          <br />
          Courses
        </Link>
      </ListGroupItem>

      <ListGroupItem className="sidebar-item">
        <Link
          href="/Calendar"
          id="wd-calendar-link"
          className="text-danger text-decoration-none"
        >
          <AiOutlineCalendar color="red" className="fs-1 text-danger" />
          <br />
          Calendar
        </Link>
      </ListGroupItem>

      <ListGroupItem className="sidebar-item">
        <Link
          href="/Inbox"
          id="wd-inbox-link"
          className="text-danger text-decoration-none"
        >
          <AiOutlineInbox color="red" className="fs-1 text-danger" />
          <br />
          Courses
        </Link>
      </ListGroupItem>

      <ListGroupItem className="sidebar-item">
        <Link
          href="/Labs"
          id="wd-labs-link"
          className="text-danger text-decoration-none"
        >
          <AiOutlineStar color="red" className="fs-1 text-danger" />
          <br />
          Labs
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}

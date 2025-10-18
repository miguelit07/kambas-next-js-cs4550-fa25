import Link from "next/link";
import * as db from "../Database";

import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
export default function Dashboard() {
  const courses = db.courses;

  return (
    <html>
      <body>
        <div id="wd-dashboard">
          <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
          <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
          <div id="wd-dashboard-courses">
            {/* Course 1 */}
            <Row xs={1} md={5} className="g-4">
              {courses.map((course) => (
                // eslint-disable-next-line react/jsx-key
                <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                  <Card>
                    <Link
                      href={`/Courses/${course._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark"
                    >
                      <CardImg
                        src="/images/reactjs.jpg"
                        variant="top"
                        width="100%"
                        height={160}
                      />
                      <CardBody className="card-body">
                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                          {course.name}{" "}
                        </CardTitle>
                        <CardText
                          className="wd-dashboard-course-description overflow-hidden"
                          style={{ height: "100px" }}
                        >
                          {course.description}{" "}
                        </CardText>
                        <Button variant="primary"> Go </Button>
                      </CardBody>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </body>
    </html>
  );
}

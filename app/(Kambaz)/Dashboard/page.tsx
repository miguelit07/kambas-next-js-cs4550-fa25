import Link from "next/link";
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
  return (
    <html>
      <body>
        <div id="wd-dashboard">
          <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
          <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
          <div id="wd-dashboard-courses">
            {/* Course 1 */}
            <Row xs={1} md={5} className="g-4">
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/reactjs.jpg"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS1234 React JS
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        Full Stack software developer
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 2 */}
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/3456"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/python.jpeg"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS3456 Python
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        Programming with Python
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 3 */}
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/4567"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/java.png"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS4567 Java
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        Object-Oriented Programming
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 4 */}
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/5678"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/sql.png"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS5678 Databases
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        SQL and NoSQL Fundamentals
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 5 */}
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/6789"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/ai.jpeg"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS6789 AI Basics
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        Introduction to Artificial Intelligence
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 6 */}
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/7890"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/algo.png"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS7890 Machine Learning
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        Algorithms and Applications
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 7 */}
              <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link
                    href="/Courses/8901"
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="/images/ui.png"
                      width="100%"
                      height={160}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        CS8901 UI/UX Design
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        Designing User-Friendly Interfaces
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </body>
    </html>
  );
}

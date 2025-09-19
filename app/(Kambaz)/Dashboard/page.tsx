import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <html>
      <body>
        <div id="wd-dashboard">
          <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
          <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
          <div id="wd-dashboard-courses">
            <div className="wd-dashboard-course">
              <Link href="/Courses/1234" className="wd-dashboard-course-link">
                <Image
                  src="/images/reactjs.jpg"
                  width={200}
                  height={150}
                  alt="react"
                />
                <div>
                  <h5> CS1234 React JS </h5>
                  <p className="wd-dashboard-course-title">
                    Full Stack software developer
                  </p>
                  <button> Go </button>
                </div>
              </Link>
            </div>
            {/* Course 2 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/2345" className="wd-dashboard-course-link">
                <Image
                  src="/images/teslabot.jpg"
                  width={200}
                  height={150}
                  alt="node"
                />
                <div>
                  <h5>CS2345 Node.js</h5>
                  <p className="wd-dashboard-course-title">
                    Backend Development with Express
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>

            {/* Course 3 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/3456" className="wd-dashboard-course-link">
                <Image
                  src="/images/python.jpeg"
                  width={200}
                  height={150}
                  alt="python"
                />
                <div>
                  <h5>CS3456 Python</h5>
                  <p className="wd-dashboard-course-title">
                    Programming with Python
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>

            {/* Course 4 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/4567" className="wd-dashboard-course-link">
                <Image
                  src="/images/java.png"
                  width={200}
                  height={150}
                  alt="java"
                />
                <div>
                  <h5>CS4567 Java</h5>
                  <p className="wd-dashboard-course-title">
                    Object-Oriented Programming
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>

            {/* Course 5 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/5678" className="wd-dashboard-course-link">
                <Image
                  src="/images/sql.png"
                  width={200}
                  height={150}
                  alt="db"
                />
                <div>
                  <h5>CS5678 Databases</h5>
                  <p className="wd-dashboard-course-title">
                    SQL and NoSQL Fundamentals
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>

            {/* Course 6 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/6789" className="wd-dashboard-course-link">
                <Image
                  src="/images/ai.jpeg"
                  width={200}
                  height={150}
                  alt="ai"
                />
                <div>
                  <h5>CS6789 AI Basics</h5>
                  <p className="wd-dashboard-course-title">
                    Introduction to Artificial Intelligence
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>

            {/* Course 7 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/7890" className="wd-dashboard-course-link">
                <Image
                  src="/images/algo.png"
                  width={200}
                  height={150}
                  alt="ml"
                />
                <div>
                  <h5>CS7890 Machine Learning</h5>
                  <p className="wd-dashboard-course-title">
                    Algorithms and Applications
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>

            {/* Course 8 */}
            <div className="wd-dashboard-course">
              <Link href="/Courses/8901" className="wd-dashboard-course-link">
                <Image
                  src="/images/ui.png"
                  width={200}
                  height={150}
                  alt="uiux"
                />
                <div>
                  <h5>CS8901 UI/UX Design</h5>
                  <p className="wd-dashboard-course-title">
                    Designing User-Friendly Interfaces
                  </p>
                  <button>Go</button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

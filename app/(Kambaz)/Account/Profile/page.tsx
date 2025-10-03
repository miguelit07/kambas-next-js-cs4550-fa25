import Link from "next/link";
import { Button } from "react-bootstrap";
export default function Profile() {
  return (
    <div
      id="wd-profile-screen"
      style={{ width: "300px", float: "left", paddingLeft: "20px" }}
      className="m-auto mt-5"
    >
      <h3>Profile</h3>
      <input
        defaultValue="alice"
        placeholder="username"
        className="wd-username"
        style={{ marginBottom: "10px" }}
      />
      <br />
      <input
        defaultValue="123"
        placeholder="password"
        type="password"
        className="wd-password"
        style={{ marginBottom: "10px" }}
      />
      <br />
      <input
        style={{ marginBottom: "10px" }}
        defaultValue="Alice"
        placeholder="First Name"
        id="wd-firstname"
      />
      <br />
      <input
        defaultValue="Wonderland"
        placeholder="Last Name"
        id="wd-lastname"
        style={{ marginBottom: "10px" }}
      />
      <br />
      <input         style={{ marginBottom: "10px" }}
defaultValue="2000-01-01" type="date" id="wd-dob" />
      <br />
      <input         style={{ marginBottom: "10px" }}
defaultValue="alice@wonderland" type="email" id="wd-email" />
      <br />
      <select         style={{ marginBottom: "10px" }}
defaultValue="FACULTY" id="wd-role">
        <option value="USER">User</option> <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>{" "}
        <option value="STUDENT">Student</option>
      </select>
      <br />
      <Link
        id="wd-signin-btn"
        href="/Account/Signin"
        className="btn btn-danger w-100 mb-2"
      >
        Sign out{" "}
      </Link>
      <br />
    </div>
  );
}

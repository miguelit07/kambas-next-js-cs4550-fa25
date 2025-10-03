import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
    <div id="wd-signin-screen" style={{ width: "300px", float: "left", paddingLeft: "20px" }} className="m-auto mt-5">
      <h1>Sign up</h1>
      <FormControl id="wd-username" placeholder="username" className="mb-2" />
      <br />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
      />
      <br />
      <Link
        id="wd-signin-btn"
        href="/Account/Profile"
        className="btn btn-primary w-100 mb-2"
      >
        Sign up{" "}
      </Link>
      <br />
      <Link id="wd-signup-link" href="/Account/Signup">
        Sign up
      </Link>
    </div>
  );
}

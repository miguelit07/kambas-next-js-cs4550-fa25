import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation">
      <div className="mb-2">
        <Link href="Signin" className="text-danger">
          Signin
        </Link>
      </div>

      <div className="mb-2">
        <Link href="Signup" className="text-danger">
          Signup
        </Link>
      </div>

      <div className="mb-2">
        <Link href="Profile" className="text-danger">
          Profile
        </Link>
      </div>
    </div>
  );
}

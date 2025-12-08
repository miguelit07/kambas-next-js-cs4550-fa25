/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button, Form } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const signup = async () => {
    try {
      setError("");
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/Account/Profile");
    } catch (err: any) {
      console.error("Signup failed:", err);
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Network error or server unavailable. Please make sure the server is running on port 4000.");
      }
    }
  };
  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}
      <FormControl 
        value={user.username || ""} 
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username mb-2" 
        placeholder="username" 
      />
      <FormControl 
        value={user.password || ""} 
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="wd-password mb-2" 
        placeholder="password" 
        type="password"
      />
      <Form.Select 
        value={user.role || "STUDENT"} 
        onChange={(e) => setUser({ ...user, role: e.target.value })}
        className="wd-role mb-2"
      >
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
      </Form.Select>
      <Button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100"> 
        Sign up 
      </Button><br />
      <Link href="/Account/Signin" className="wd-signin-link">Sign in</Link>
    </div>
  );
}

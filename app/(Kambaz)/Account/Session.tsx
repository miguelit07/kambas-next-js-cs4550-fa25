/* eslint-disable @typescript-eslint/no-explicit-any */
import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await client.profile();
        dispatch(setCurrentUser(currentUser));
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          dispatch(setCurrentUser(null));
        } else {
          console.error("Session fetch error:", err);
        }
      }
      setPending(false);
    };
    
    fetchProfile();
  }, [dispatch]);
  
  if (!pending) {
    return children;
  }
}
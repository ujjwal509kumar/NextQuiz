"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SIgnInComponent from "./components/SIgnInComponent";
import QuizComponent from "./components/QuizComponent";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Component() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  console.log(session)

  useEffect(() => {
    if (status === "authenticated" || status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  if (session) {
    return <><Header/><QuizComponent/><Footer/></>
  }
  return <><Header/><SIgnInComponent /><Footer/></>
}

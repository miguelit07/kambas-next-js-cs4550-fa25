import { redirect } from "next/navigation";

export default function CoursesPage({
  params,
}: { params: { cid: string } }) {
  return <div>Course {params.cid}</div>;
}


import { ReactNode } from "react";

interface CourseLayoutProps {
  children: ReactNode;
  params: { cid: string };
}

export default function CourseLayout({ children, params }: CourseLayoutProps) {
  return (
    <div>
      <h1>Course: {params.cid}</h1>
      {children}
    </div>
  );
}

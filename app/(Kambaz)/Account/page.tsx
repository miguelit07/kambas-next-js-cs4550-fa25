interface CoursePageProps {
  params: { cid: string };
}

export default function CoursePage({ params }: CoursePageProps) {
  return <div>Welcome to course {params.cid}</div>;
}

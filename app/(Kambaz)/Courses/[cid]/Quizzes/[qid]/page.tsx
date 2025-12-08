"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { findQuizById } from "@/app/(Kambaz)/Quizzes/client";

interface RootState {
  accountReducer: {
    currentUser: {
      _id: string;
      username: string;
      role: string;
    } | null;
  };
}

interface Question {
  _id: string;
  type: string;
  title: string;
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  points: number;
  assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers: boolean;
  timeLimit: number; // in minutes
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: "Immediately" | "After Last Attempt" | "Never" | "After Due Date";
  accessCode?: string;
  oneQuestionAtTime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
  course: string;
  questions: Question[];
}

interface AttemptInfo {
  attemptCount: number;
  attempts: {
    attemptNumber: number;
    score: { earned: number; possible: number };
    timeCompleted: string;
  }[];
}

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attemptInfo, setAttemptInfo] = useState<AttemptInfo | null>(null);

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);
        
        // For students, also fetch attempt info
        if (!isFaculty && currentUser?._id) {
          try {
            const response = await fetch(`/api/quizzes/${qid}/can-take/${currentUser._id}`);
            if (response.ok) {
              const attemptData = await response.json();
              setAttemptInfo(attemptData);
            }
          } catch (attemptErr) {
            console.log("Could not fetch attempt info:", attemptErr);
          }
        }
      } catch (err: unknown) {
        console.error("Failed to fetch quiz:", err);
        setError("Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };

    if (qid) {
      fetchQuiz();
    }
  }, [qid, isFaculty, currentUser]);

  const handlePreview = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const handleEdit = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/editor`);
  };

  const handleStartQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/take`);
  };

  const handleViewResults = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/results`);
  };

  const canTakeQuiz = (): boolean => {
    if (!quiz || !attemptInfo) return true;
    
    if (!quiz.multipleAttempts && attemptInfo.attemptCount > 0) {
      return false;
    }
    
    return attemptInfo.attemptCount < quiz.howManyAttempts;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !quiz) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger" role="alert">
          {error || "Quiz not found"}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header with Quiz Title and Action Buttons */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>{quiz.title}</h2>
              {quiz.description && (
                <p className="text-muted">{quiz.description}</p>
              )}
            </div>
            <div className="d-flex gap-2">
              {isFaculty ? (
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleEdit}
                  >
                    ✏️ Edit
                  </Button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  {attemptInfo && attemptInfo.attemptCount > 0 && (
                    <Button
                      variant="outline-primary"
                      onClick={handleViewResults}
                    >
                      View Results
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleStartQuiz}
                    disabled={!quiz.published || !canTakeQuiz()}
                  >
                    {attemptInfo && attemptInfo.attemptCount > 0 ? 'Retake Quiz' : 'Take Quiz'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Quiz Details Card */}
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quiz Details</h5>
            </Card.Header>
            <Card.Body>
              <Table className="table-borderless">
                <tbody>
                  <tr>
                    <td><strong>Quiz Type</strong></td>
                    <td>{quiz.quizType}</td>
                  </tr>
                  <tr>
                    <td><strong>Points</strong></td>
                    <td>{quiz.points}</td>
                  </tr>
                  <tr>
                    <td><strong>Assignment Group</strong></td>
                    <td>{quiz.assignmentGroup}</td>
                  </tr>
                  <tr>
                    <td><strong>Shuffle Answers</strong></td>
                    <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td><strong>Time Limit</strong></td>
                    <td>{quiz.timeLimit} Minutes</td>
                  </tr>
                  <tr>
                    <td><strong>Multiple Attempts</strong></td>
                    <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
                  </tr>
                  {quiz.multipleAttempts && (
                    <tr>
                      <td><strong>How Many Attempts</strong></td>
                      <td>{quiz.howManyAttempts}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>Show Correct Answers</strong></td>
                    <td>{quiz.showCorrectAnswers}</td>
                  </tr>
                  {quiz.accessCode && (
                    <tr>
                      <td><strong>Access Code</strong></td>
                      <td>{isFaculty ? quiz.accessCode : "••••••••"}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>One Question at a Time</strong></td>
                    <td>{quiz.oneQuestionAtTime ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td><strong>Webcam Required</strong></td>
                    <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td><strong>Lock Questions After Answering</strong></td>
                    <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Availability and Dates */}
        <Col lg={4}>
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Availability</h6>
            </Card.Header>
            <Card.Body>
              <Table className="table-sm table-borderless">
                <tbody>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>
                      <Badge bg={quiz.published ? "success" : "secondary"}>
                        {quiz.published ? "Published" : "Unpublished"}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Available from</strong></td>
                    <td>{formatDate(quiz.availableDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Due</strong></td>
                    <td>{formatDate(quiz.dueDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Until</strong></td>
                    <td>{formatDate(quiz.untilDate)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {isFaculty && (
            <Card>
              <Card.Header>
                <h6 className="mb-0">Questions</h6>
              </Card.Header>
              <Card.Body>
                <p className="mb-1">
                  <strong>Total Questions:</strong> {quiz.questions?.length || 0}
                </p>
                <p className="mb-0">
                  <strong>Total Points:</strong> {quiz.points}
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Student Instructions */}
      {!isFaculty && (
        <Row className="mt-4">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <h6>Quiz Instructions:</h6>
                <ul className="mb-0">
                  {quiz.timeLimit && (
                    <li>This quiz has a time limit of {quiz.timeLimit} minutes.</li>
                  )}
                  {quiz.multipleAttempts ? (
                    <li>You have {quiz.howManyAttempts} attempts to complete this quiz.</li>
                  ) : (
                    <li>You have only one attempt to complete this quiz.</li>
                  )}
                  {quiz.oneQuestionAtTime && (
                    <li>Questions will be shown one at a time.</li>
                  )}
                  {quiz.lockQuestionsAfterAnswering && (
                    <li>You cannot change answers after moving to the next question.</li>
                  )}
                  {quiz.webcamRequired && (
                    <li>A webcam is required for this quiz.</li>
                  )}
                  {quiz.accessCode && (
                    <li>An access code is required to start this quiz.</li>
                  )}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
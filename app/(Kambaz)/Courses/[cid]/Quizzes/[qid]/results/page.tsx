"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table
} from "react-bootstrap";
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
  title: string;
  points: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK";
  choices?: { text: string; correct: boolean }[];
  correctAnswers?: string[];
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  points: number;
  questions: Question[];
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
}

interface AttemptAnswer {
  questionId: string;
  selectedChoiceId?: string;
  textAnswer?: string;
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
}

interface QuizAttempt {
  _id: string;
  attemptNumber: number;
  answers: AttemptAnswer[];
  totalScore: { earned: number; possible: number };
  timeStarted: string;
  timeCompleted: string;
  timeTaken: number;
}

export default function QuizResults() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    if (!isStudent) {
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
      return;
    }

    const fetchResultsData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);

        // Fetch student's attempts
        const attemptsResponse = await fetch(`/api/quizzes/${qid}/attempts/${currentUser?._id}`);
        if (attemptsResponse.ok) {
          const attemptsData = await attemptsResponse.json();
          setAttempts(attemptsData);
          
          // Get latest attempt for detailed view
          if (attemptsData.length > 0) {
            setLatestAttempt(attemptsData[0]); // Already sorted by attemptNumber desc
          }
        }
      } catch (err: unknown) {
        console.error("Failed to fetch results data:", err);
        setError("Failed to load quiz results");
      } finally {
        setLoading(false);
      }
    };

    if (qid && currentUser?._id) {
      fetchResultsData();
    }
  }, [qid, currentUser, isStudent, router, cid]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionByIndex = (questionId: string): Question | undefined => {
    return quiz?.questions.find(q => q._id === questionId);
  };

  const getCorrectAnswerText = (question: Question): string => {
    if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
      const correctChoice = question.choices?.find(c => c.correct);
      return correctChoice?.text || "No correct answer found";
    } else if (question.questionType === "FILL_IN_THE_BLANK") {
      return question.correctAnswers?.join(", ") || "No correct answers found";
    }
    return "";
  };

  const getUserAnswerText = (answer: AttemptAnswer, question: Question): string => {
    if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
      if (!answer.selectedChoiceId) return "No answer selected";
      
      const choiceIndex = parseInt(answer.selectedChoiceId.replace("choice-", ""));
      const selectedChoice = question.choices?.[choiceIndex];
      return selectedChoice?.text || "Invalid answer";
    } else if (question.questionType === "FILL_IN_THE_BLANK") {
      return answer.textAnswer || "No answer provided";
    }
    return "No answer";
  };

  const canTakeAgain = (): boolean => {
    if (!quiz || !attempts.length) return true;
    
    if (!quiz.multipleAttempts) return false;
    
    return attempts.length < quiz.howManyAttempts;
  };

  const shouldShowCorrectAnswers = (): boolean => {
    if (!quiz) return false;
    
    switch (quiz.showCorrectAnswers) {
      case "IMMEDIATELY":
        return true;
      case "AFTER_LAST_ATTEMPT":
        return !canTakeAgain();
      case "NEVER":
        return false;
      case "AFTER_DUE_DATE":
        // For now, show immediately (would need due date logic)
        return true;
      default:
        return true;
    }
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  if (!quiz || !latestAttempt) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No quiz results found</Alert>
        <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const percentage = Math.round((latestAttempt.totalScore.earned / latestAttempt.totalScore.possible) * 100);

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Quiz Results</h2>
              <p className="text-muted mb-0">{quiz.title}</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                Back to Quizzes
              </Button>
              {canTakeAgain() && (
                <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}>
                  Take Again
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Score Summary */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="text-center">
            <Col md={3}>
              <h3 className="text-primary">{latestAttempt.totalScore.earned}/{latestAttempt.totalScore.possible}</h3>
              <p className="text-muted mb-0">Points</p>
            </Col>
            <Col md={3}>
              <h3 className={percentage >= 70 ? "text-success" : "text-danger"}>{percentage}%</h3>
              <p className="text-muted mb-0">Score</p>
            </Col>
            <Col md={3}>
              <h3 className="text-info">{latestAttempt.answers.filter(a => a.correct).length}/{latestAttempt.answers.length}</h3>
              <p className="text-muted mb-0">Correct</p>
            </Col>
            <Col md={3}>
              <h3 className="text-secondary">{formatTime(latestAttempt.timeTaken)}</h3>
              <p className="text-muted mb-0">Time Taken</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Attempts History */}
      {attempts.length > 1 && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Attempt History</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Time Taken</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map(attempt => {
                  const attemptPercentage = Math.round((attempt.totalScore.earned / attempt.totalScore.possible) * 100);
                  return (
                    <tr key={attempt._id} className={attempt._id === latestAttempt._id ? "table-primary" : ""}>
                      <td>
                        {attempt.attemptNumber}
                        {attempt._id === latestAttempt._id && <Badge bg="primary" className="ms-2">Latest</Badge>}
                      </td>
                      <td>{attempt.totalScore.earned}/{attempt.totalScore.possible}</td>
                      <td>
                        <span className={attemptPercentage >= 70 ? "text-success" : "text-danger"}>
                          {attemptPercentage}%
                        </span>
                      </td>
                      <td>{formatTime(attempt.timeTaken)}</td>
                      <td>{new Date(attempt.timeCompleted).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Question Results */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Question Results</h5>
        </Card.Header>
        <Card.Body>
          {latestAttempt.answers.map((answer, index) => {
            const question = getQuestionByIndex(answer.questionId);
            if (!question) return null;

            return (
              <Card key={answer.questionId} className="mb-3">
                <Card.Header className={`d-flex justify-content-between align-items-center ${answer.correct ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                  <div>
                    <h6 className="mb-0">
                      Question {index + 1}: {question.title}
                    </h6>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={answer.correct ? "success" : "danger"}>
                      {answer.correct ? "✓ Correct" : "✗ Incorrect"}
                    </Badge>
                    <Badge bg="secondary">{answer.earnedPoints}/{answer.maxPoints} pts</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <h6 className="mb-3">{question.questionText}</h6>
                  
                  <div className="mb-2">
                    <strong>Your Answer:</strong>
                    <span className={`ms-2 ${answer.correct ? 'text-success' : 'text-danger'}`}>
                      {getUserAnswerText(answer, question)}
                    </span>
                  </div>
                  
                  {shouldShowCorrectAnswers() && !answer.correct && (
                    <div className="mb-2">
                      <strong>Correct Answer:</strong>
                      <span className="ms-2 text-success">
                        {getCorrectAnswerText(question)}
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </Card.Body>
      </Card>
    </Container>
  );
}
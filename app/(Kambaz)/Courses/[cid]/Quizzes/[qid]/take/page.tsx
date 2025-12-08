"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  ProgressBar,
  Modal
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
  quizType: string;
  points: number;
  timeLimit: number;
  questions: Question[];
  instructions?: string;
  oneQuestionAtTime: boolean;
  shuffleAnswers: boolean;
  multipleAttempts: boolean;
  howManyAttempts: number;
  published: boolean;
}

interface Answer {
  questionId: string;
  selectedChoiceId?: string;
  textAnswer?: string;
}

interface QuizAttempt {
  attemptNumber: number;
  score: { earned: number; possible: number };
  timeCompleted: string;
}

interface AttemptInfo {
  attemptCount: number;
  attempts: QuizAttempt[];
}

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attemptInfo, setAttemptInfo] = useState<AttemptInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Quiz taking states
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    if (!isStudent) {
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
      return;
    }

    const fetchQuizData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);
        
        if (!quizData.published) {
          setError("This quiz is not yet available");
          return;
        }

        // Fetch attempt info
        const response = await fetch(`/api/quizzes/${qid}/can-take/${currentUser?._id}`);
        if (response.ok) {
          const attemptData = await response.json();
          setAttemptInfo(attemptData);
          
          // Check if student can take quiz
          if (!quizData.multipleAttempts && attemptData.attemptCount > 0) {
            setError("You have already taken this quiz");
            return;
          }
          
          if (quizData.multipleAttempts && attemptData.attemptCount >= quizData.howManyAttempts) {
            setError(`You have exhausted all ${quizData.howManyAttempts} attempts for this quiz`);
            return;
          }
        }
      } catch (err: unknown) {
        console.error("Failed to fetch quiz data:", err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (qid && currentUser?._id) {
      fetchQuizData();
    }
  }, [qid, currentUser, isStudent, router, cid]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, quizSubmitted, timeRemaining]);

  const handleStartQuiz = () => {
    if (!quiz) return;
    
    setQuizStarted(true);
    setTimeStarted(new Date());
    setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (questionId: string, selectedChoiceId?: string, textAnswer?: string) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      const newAnswer: Answer = { questionId, selectedChoiceId, textAnswer };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const getCurrentAnswer = (questionId: string): Answer | undefined => {
    return answers.find(a => a.questionId === questionId);
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAutoSubmit = useCallback(() => {
    if (!timeStarted || !currentUser) return;
    submitQuiz(true);
  }, [timeStarted, currentUser]);

  const submitQuiz = async (autoSubmit = false) => {
    if (!quiz || !timeStarted || !currentUser) return;

    try {
      const timeCompleted = new Date();
      
      // Calculate scores
      const scoredAnswers = quiz.questions.map(question => {
        const userAnswer = answers.find(a => a.questionId === question._id);
        let correct = false;
        let userAnswerText = "No answer provided";

        if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
          const selectedChoice = question.choices?.find((c, index) => {
            const choiceId = `choice-${index}`;
            return choiceId === userAnswer?.selectedChoiceId;
          });
          correct = selectedChoice?.correct || false;
          userAnswerText = selectedChoice?.text || "No answer selected";
        } else if (question.questionType === "FILL_IN_THE_BLANK") {
          const userText = userAnswer?.textAnswer?.toLowerCase().trim() || "";
          correct = question.correctAnswers?.some(ans => 
            ans.toLowerCase().trim() === userText
          ) || false;
          userAnswerText = userAnswer?.textAnswer || "No answer provided";
        }

        return {
          questionId: question._id,
          selectedChoiceId: userAnswer?.selectedChoiceId,
          textAnswer: userAnswer?.textAnswer,
          correct,
          earnedPoints: correct ? question.points : 0,
          maxPoints: question.points
        };
      });

      const totalScore = {
        earned: scoredAnswers.reduce((sum, a) => sum + a.earnedPoints, 0),
        possible: scoredAnswers.reduce((sum, a) => sum + a.maxPoints, 0)
      };

      // Submit to backend
      const response = await fetch(`/api/quizzes/${qid}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser._id,
          answers: scoredAnswers,
          totalScore,
          timeStarted: timeStarted.toISOString(),
          timeCompleted: timeCompleted.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      setQuizSubmitted(true);
      setShowSubmitConfirm(false);
      
      // Redirect to results after a short delay
      setTimeout(() => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/results`);
      }, 2000);

    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  if (!quiz) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Quiz not found</Alert>
      </Container>
    );
  }

  if (quizSubmitted) {
    return (
      <Container className="mt-4">
        <Alert variant="success">
          <h5>Quiz Submitted Successfully!</h5>
          <p>Your answers have been saved. Redirecting to results...</p>
        </Alert>
      </Container>
    );
  }

  // Pre-start screen
  if (!quizStarted) {
    return (
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>{quiz.title}</h2>
                <p className="text-muted mb-0">Quiz</p>
              </div>
              <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                Back to Quizzes
              </Button>
            </div>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Instructions</h5>
          </Card.Header>
          <Card.Body>
            {quiz.description && (
              <div className="mb-3">
                <h6>Description:</h6>
                <p className="text-muted">{quiz.description}</p>
              </div>
            )}

            <Row className="mb-4">
              <Col md={6}>
                <ul className="list-unstyled">
                  <li><strong>Questions:</strong> {quiz.questions.length}</li>
                  <li><strong>Points:</strong> {quiz.points}</li>
                  <li><strong>Time Limit:</strong> {quiz.timeLimit} minutes</li>
                </ul>
              </Col>
              <Col md={6}>
                <ul className="list-unstyled">
                  <li><strong>Attempts:</strong> {quiz.multipleAttempts ? `${attemptInfo?.attemptCount || 0}/${quiz.howManyAttempts}` : attemptInfo?.attemptCount ? "1/1" : "0/1"}</li>
                  <li><strong>Question Display:</strong> {quiz.oneQuestionAtTime ? "One at a time" : "All at once"}</li>
                </ul>
              </Col>
            </Row>

            {attemptInfo && attemptInfo.attempts.length > 0 && (
              <div className="mb-4">
                <h6>Previous Attempts:</h6>
                {attemptInfo.attempts.map((attempt, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                    <span>Attempt {attempt.attemptNumber}</span>
                    <div>
                      <Badge bg="primary" className="me-2">
                        {attempt.score.earned}/{attempt.score.possible} points
                      </Badge>
                      <small className="text-muted">
                        {new Date(attempt.timeCompleted).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleStartQuiz}
                disabled={quiz.questions.length === 0}
              >
                Begin Quiz
              </Button>
              {quiz.questions.length === 0 && (
                <p className="text-muted mt-2">
                  This quiz has no questions yet
                </p>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Quiz taking interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion._id);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <>
      <Container className="mt-4">
        {/* Quiz Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>{quiz.title}</h2>
                <p className="text-muted mb-0">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </p>
              </div>
              <div className="text-end">
                <div className="h5 mb-1">Time Remaining</div>
                <Badge 
                  bg={timeRemaining < 300 ? "danger" : "primary"} 
                  className="fs-6"
                >
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* Progress Bar */}
        <ProgressBar now={progress} className="mb-4" />

        {/* Question */}
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{currentQuestion.title}</h5>
              <Badge bg="secondary">{currentQuestion.points} pts</Badge>
            </div>
          </Card.Header>
          
          <Card.Body>
            <h6 className="mb-3">{currentQuestion.questionText}</h6>
            
            {/* Multiple Choice / True False */}
            {(currentQuestion.questionType === "MULTIPLE_CHOICE" || currentQuestion.questionType === "TRUE_FALSE") && (
              <div className="mb-3">
                {currentQuestion.choices?.map((choice, index) => {
                  const choiceId = `choice-${index}`;
                  const inputId = `${currentQuestion._id}-${choiceId}`;
                  return (
                    <div key={choiceId} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${currentQuestion._id}`}
                        id={inputId}
                        checked={currentAnswer?.selectedChoiceId === choiceId}
                        onChange={() => handleAnswerChange(currentQuestion._id, choiceId)}
                      />
                      <label className="form-check-label" htmlFor={inputId}>
                        {choice.text}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Fill in the Blank */}
            {currentQuestion.questionType === "FILL_IN_THE_BLANK" && (
              <div className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter your answer here..."
                  value={currentAnswer?.textAnswer || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, undefined, e.target.value)}
                />
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Navigation */}
        <div className="d-flex justify-content-between mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>
          
          <div className="d-flex gap-2">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button 
                variant="success" 
                onClick={() => setShowSubmitConfirm(true)}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleNextQuestion}
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Submit Confirmation Modal */}
      <Modal show={showSubmitConfirm} onHide={() => setShowSubmitConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit your quiz?</p>
          <p><strong>Time remaining:</strong> {formatTime(timeRemaining)}</p>
          <p><strong>Questions answered:</strong> {answers.length}/{quiz.questions.length}</p>
          <p className="text-muted">You cannot change your answers after submitting.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitConfirm(false)}>
            Continue Quiz
          </Button>
          <Button variant="success" onClick={() => submitQuiz(false)}>
            Submit Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
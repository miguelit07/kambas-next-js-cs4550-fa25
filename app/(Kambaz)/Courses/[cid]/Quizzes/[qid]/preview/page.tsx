"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Row, Col, Card, Button, Alert, Badge, Form, ProgressBar } from "react-bootstrap";
import { findQuizById } from "@/app/(Kambaz)/Quizzes/client";

interface Choice {
  id: string;
  text: string;
  correct: boolean;
}

interface Question {
  _id: string;
  title: string;
  points: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK";
  choices?: Choice[];
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
}

interface Answer {
  questionId: string;
  selectedChoiceId?: string;
  textAnswer?: string;
}

interface QuestionResult {
  questionId: string;
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
  userAnswer: string;
  correctAnswer: string;
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Quiz taking state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [totalScore, setTotalScore] = useState({ earned: 0, possible: 0 });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);
        setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
      } catch (err: unknown) {
        console.error("Failed to fetch quiz:", err);
        setError("Failed to load quiz preview");
      } finally {
        setLoading(false);
      }
    };

    if (qid) {
      fetchQuiz();
    }
  }, [qid]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            if (quiz) {
              const quizResults: QuestionResult[] = quiz.questions.map(question => {
                const userAnswer = answers.find(a => a.questionId === question._id);
                let correct = false;
                let userAnswerText = "No answer provided";
                let correctAnswerText = "";

                if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
                  // Handle both choice.id and index-based choice identification
                  const selectedChoice = question.choices?.find((c, index) => {
                    const choiceId = c.id || `choice-${index}`;
                    return choiceId === userAnswer?.selectedChoiceId;
                  });
                  correct = selectedChoice?.correct || false;
                  userAnswerText = selectedChoice?.text || "No answer selected";
                  correctAnswerText = question.choices?.find(c => c.correct)?.text || "";
                } else if (question.questionType === "FILL_IN_THE_BLANK") {
                  const userText = userAnswer?.textAnswer?.toLowerCase().trim() || "";
                  correct = question.correctAnswers?.some(ans => 
                    ans.toLowerCase().trim() === userText
                  ) || false;
                  userAnswerText = userAnswer?.textAnswer || "No answer provided";
                  correctAnswerText = question.correctAnswers?.join(", ") || "";
                }

                return {
                  questionId: question._id,
                  correct,
                  earnedPoints: correct ? question.points : 0,
                  maxPoints: question.points,
                  userAnswer: userAnswerText,
                  correctAnswer: correctAnswerText
                };
              });

              const totalEarned = quizResults.reduce((sum, r) => sum + r.earnedPoints, 0);
              const totalPossible = quizResults.reduce((sum, r) => sum + r.maxPoints, 0);

              setResults(quizResults);
              setTotalScore({ earned: totalEarned, possible: totalPossible });
              setQuizSubmitted(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, quizSubmitted, timeRemaining, quiz, answers]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
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

  const handleSubmitQuiz = useCallback(() => {
    if (!quiz) return;

    const quizResults: QuestionResult[] = quiz.questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question._id);
      let correct = false;
      let userAnswerText = "No answer provided";
      let correctAnswerText = "";

      if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
        // Handle both choice.id and index-based choice identification
        const selectedChoice = question.choices?.find((c, index) => {
          const choiceId = c.id || `choice-${index}`;
          return choiceId === userAnswer?.selectedChoiceId;
        });
        correct = selectedChoice?.correct || false;
        userAnswerText = selectedChoice?.text || "No answer selected";
        correctAnswerText = question.choices?.find(c => c.correct)?.text || "";
      } else if (question.questionType === "FILL_IN_THE_BLANK") {
        const userText = userAnswer?.textAnswer?.toLowerCase().trim() || "";
        correct = question.correctAnswers?.some(ans => 
          ans.toLowerCase().trim() === userText
        ) || false;
        userAnswerText = userAnswer?.textAnswer || "No answer provided";
        correctAnswerText = question.correctAnswers?.join(", ") || "";
      }

      return {
        questionId: question._id,
        correct,
        earnedPoints: correct ? question.points : 0,
        maxPoints: question.points,
        userAnswer: userAnswerText,
        correctAnswer: correctAnswerText
      };
    });

    const totalEarned = quizResults.reduce((sum, r) => sum + r.earnedPoints, 0);
    const totalPossible = quizResults.reduce((sum, r) => sum + r.maxPoints, 0);

    setResults(quizResults);
    setTotalScore({ earned: totalEarned, possible: totalPossible });
    setQuizSubmitted(true);
  }, [quiz, answers]);

  const handleEditQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/editor`);
  };

  const handleBackToDetails = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
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
        <Alert variant="danger">{error || "Quiz not found"}</Alert>
      </Container>
    );
  }

  if (quizSubmitted) {
    const percentage = Math.round((totalScore.earned / totalScore.possible) * 100);
    
    return (
      <Container className="mt-4">
        {/* Results Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>Quiz Results</h2>
                <p className="text-muted mb-0">{quiz.title}</p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={handleBackToDetails}>
                  Back to Details
                </Button>
                <Button variant="primary" onClick={handleEditQuiz}>
                  Edit Quiz
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Score Summary */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="text-center">
              <Col md={3}>
                <h3 className="text-primary">{totalScore.earned}/{totalScore.possible}</h3>
                <p className="text-muted mb-0">Points</p>
              </Col>
              <Col md={3}>
                <h3 className={percentage >= 70 ? "text-success" : "text-danger"}>{percentage}%</h3>
                <p className="text-muted mb-0">Score</p>
              </Col>
              <Col md={3}>
                <h3 className="text-info">{results.filter(r => r.correct).length}/{results.length}</h3>
                <p className="text-muted mb-0">Correct</p>
              </Col>
              <Col md={3}>
                <h3 className="text-secondary">{quiz.questions.length}</h3>
                <p className="text-muted mb-0">Total Questions</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Question Results */}
        <div className="mb-4">
          <h4>Question Review</h4>
          {quiz.questions.map((question, index) => {
            const result = results.find(r => r.questionId === question._id);
            if (!result) return null;

            return (
              <Card key={question._id} className="mb-3">
                <Card.Header className={`${result.correct ? 'bg-success' : 'bg-danger'} text-white`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Question {index + 1}</span>
                    <Badge bg={result.correct ? "light" : "light"} text={result.correct ? "success" : "danger"}>
                      {result.earnedPoints}/{result.maxPoints} pts
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <h6>{question.title}</h6>
                  <p>{question.questionText}</p>
                  
                  <Row>
                    <Col md={6}>
                      <strong>Your Answer:</strong>
                      <p className={result.correct ? "text-success" : "text-danger"}>
                        {result.userAnswer}
                      </p>
                    </Col>
                    <Col md={6}>
                      <strong>Correct Answer:</strong>
                      <p className="text-success">{result.correctAnswer}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        <div className="text-center mb-4">
          <Button variant="primary" onClick={() => {
            setQuizStarted(false);
            setQuizSubmitted(false);
            setCurrentQuestionIndex(0);
            setAnswers([]);
            setResults([]);
            setTimeRemaining(quiz.timeLimit * 60);
          }}>
            Retake Quiz Preview
          </Button>
        </div>
      </Container>
    );
  }

  if (!quizStarted) {
    return (
      <Container className="mt-4">
        {/* Pre-Quiz Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>Quiz Preview</h2>
                <p className="text-muted mb-0">{quiz.title}</p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" onClick={handleBackToDetails}>
                  Back to Details
                </Button>
                <Button variant="primary" onClick={handleEditQuiz}>
                  Edit Quiz
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Preview Info */}
        <Alert variant="info" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Faculty Preview Mode:</strong> Take this quiz as a student would see it. Your answers will not be saved.
            </div>
            <Badge bg="secondary">{quiz.questions?.length || 0} Questions • {quiz.points} Points</Badge>
          </div>
        </Alert>

        {/* Quiz Info */}
        <Card>
          <Card.Header>
            <h4 className="mb-0">{quiz.title}</h4>
          </Card.Header>
          
          <Card.Body>
            {quiz.description && (
              <div className="mb-4">
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
                  <li><strong>Question Display:</strong> {quiz.oneQuestionAtTime ? "One at a time" : "All at once"}</li>
                  <li><strong>Shuffle Answers:</strong> {quiz.shuffleAnswers ? "Yes" : "No"}</li>
                </ul>
              </Col>
            </Row>

            <div className="text-center">
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleStartQuiz}
                disabled={quiz.questions.length === 0}
              >
                Begin Quiz Preview
              </Button>
              {quiz.questions.length === 0 && (
                <p className="text-muted mt-2">
                  Add questions to the quiz before previewing
                </p>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Quiz Taking Interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion._id);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
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
                const choiceId = choice.id || `choice-${index}`;
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
              onClick={handleSubmitQuiz}
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

      {/* Question Navigator */}
      {!quiz.oneQuestionAtTime && (
        <Card>
          <Card.Header>
            <h6 className="mb-0">Question Navigator</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {quiz.questions.map((_, index) => {
                const hasAnswer = answers.some(a => a.questionId === quiz.questions[index]._id);
                return (
                  <Button
                    key={index}
                    variant={
                      index === currentQuestionIndex 
                        ? "primary" 
                        : hasAnswer 
                        ? "success" 
                        : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            <small className="text-muted d-block mt-2">
              Green = Answered • Blue = Current • Gray = Unanswered
            </small>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
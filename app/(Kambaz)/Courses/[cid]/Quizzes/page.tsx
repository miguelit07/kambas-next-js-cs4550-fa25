"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, Button, Card, Row, Col, Badge } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes } from "./reducer";
import { useEffect, useState } from "react";
import * as client from "../../../Quizzes/client";
import QuizControlButtons from "./QuizControlButtonsNew";

interface Quiz {
  _id: string;
  title: string;
  course: string;
  published: boolean;
  availableDate?: string;
  availableUntil?: string;
  dueDate?: string;
  points: number;
  questionCount?: number;
  description?: string;
  timeLimit?: number;
  multipleAttempts?: boolean;
  showCorrectAnswers?: boolean;
}

export default function Quizzes() {
  const params = useParams();
  const cid = params.cid as string;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "STUDENT";
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzes = await client.findQuizzesForCourse(cid);
      dispatch(setQuizzes(quizzes));
    };
    fetchQuizzes();
  }, [cid, dispatch]);

  const onDeleteQuiz = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    dispatch(setQuizzes(quizzes.filter((q: Quiz) => q._id !== quizId)));
  };

  const onPublishToggle = async (quiz: Quiz) => {
    const updatedQuiz = quiz.published 
      ? await client.unpublishQuiz(quiz._id)
      : await client.publishQuiz(quiz._id);
    
    const updatedQuizzes = quizzes.map((q: Quiz) => 
      q._id === quiz._id ? updatedQuiz : q
    );
    dispatch(setQuizzes(updatedQuizzes));
  };

  const createNewQuiz = async () => {
    setLoading(true);
    try {
      const newQuiz = {
        title: "New Quiz",
        course: cid,
        published: false,
        points: 100,
        questionCount: 0,
        description: "New Quiz Description",
        availableDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };
      const createdQuiz = await client.createQuiz(cid, newQuiz);
      dispatch(setQuizzes([...quizzes, createdQuiz]));
      // Navigate to quiz editor for new quiz
      window.location.href = `/Courses/${cid}/Quizzes/${createdQuiz._id}/editor`;
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizAvailability = (quiz: Quiz) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
    
    if (!quiz.published) {
      return { status: "unpublished", text: "Not Published" };
    }
    
    if (availableDate && now < availableDate) {
      return { 
        status: "not-available", 
        text: `Not available until ${availableDate.toLocaleDateString()}` 
      };
    }
    
    if (availableUntil && now > availableUntil) {
      return { status: "closed", text: "Closed" };
    }
    
    return { status: "available", text: "Available" };
  };

  const getQuizStatusIcon = (quiz: Quiz) => {
    const availability = getQuizAvailability(quiz);
    
    if (availability.status === "unpublished") {
      return <span className="text-danger" title="Unpublished">🚫</span>;
    }
    
    if (availability.status === "available") {
      return <span className="text-success" title="Published">✅</span>;
    }
    
    return <span className="text-warning" title={availability.text}>⚠️</span>;
  };

  return (
    <div className="p-3">
      {/* Quiz Controls - Faculty Only */}
      {isFaculty && (
        <div className="d-flex justify-content-end mb-4">
          <Button 
            variant="danger" 
            onClick={createNewQuiz}
            disabled={loading}
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" />
            Quiz
          </Button>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search for Quiz"
          style={{ maxWidth: "300px" }}
        />
      </div>
      
      {/* Quizzes List */}
      <div id="wd-quizzes">
        <h4 className="mb-3 d-flex align-items-center">
          <BsGripVertical className="me-2" />
          Assignment Quizzes
        </h4>
        
        {quizzes.length === 0 ? (
          <Card className="text-center p-4">
            <Card.Body>
              <h5 className="text-muted mb-3">No Quizzes Yet</h5>
              <p className="text-muted mb-3">
                {isFaculty 
                  ? "Click the '+ Quiz' button to create your first quiz."
                  : "No quizzes are available for this course yet."
                }
              </p>
              {isFaculty && (
                <Button 
                  variant="danger" 
                  onClick={createNewQuiz}
                  disabled={loading}
                  className="d-flex align-items-center mx-auto"
                >
                  <FaPlus className="me-2" />
                  Create Your First Quiz
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <ListGroup className="rounded-0">
            {quizzes.map((quiz: Quiz) => {
              const availability = getQuizAvailability(quiz);
              const canAccess = isFaculty || (quiz.published && availability.status === "available");
              
              return (
                <ListGroupItem key={quiz._id} className="border-start border-success border-3 p-3">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <BsGripVertical className="text-muted" size={20} />
                    </Col>
                    
                    <Col xs="auto">
                      {isFaculty ? (
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none"
                          onClick={() => onPublishToggle(quiz)}
                        >
                          {getQuizStatusIcon(quiz)}
                        </Button>
                      ) : (
                        getQuizStatusIcon(quiz)
                      )}
                    </Col>
                    
                    <Col>
                      <div>
                        {canAccess ? (
                          <Link
                            href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                            className="text-decoration-none fw-bold text-dark"
                          >
                            {quiz.title}
                          </Link>
                        ) : (
                          <span className="fw-bold text-muted">{quiz.title}</span>
                        )}
                      </div>
                      
                      <div className="small text-muted mt-1">
                        <div className="mb-1">
                          <strong>Availability:</strong> 
                          <span className={`ms-1 ${
                            availability.status === "available" ? "text-success" :
                            availability.status === "closed" ? "text-danger" : "text-warning"
                          }`}>
                            {availability.text}
                          </span>
                        </div>
                        
                        {quiz.dueDate && (
                          <div className="mb-1">
                            <strong>Due:</strong> {new Date(quiz.dueDate).toLocaleDateString()} at {new Date(quiz.dueDate).toLocaleTimeString()}
                          </div>
                        )}
                        
                        <div className="mb-1">
                          <strong>Points:</strong> {quiz.points} pts
                        </div>
                        
                        <div>
                          <strong>Questions:</strong> {quiz.questionCount || 0} Questions
                        </div>
                        
                        {isStudent && quiz.published && (
                          <div className="mt-2">
                            <Badge bg="info">Last Score: Not attempted</Badge>
                          </div>
                        )}
                      </div>
                    </Col>
                    
                    {isFaculty && (
                      <Col xs="auto">
                        <QuizControlButtons 
                          quiz={quiz}
                          onDelete={() => onDeleteQuiz(quiz._id)}
                          onPublishToggle={() => onPublishToggle(quiz)}
                        />
                      </Col>
                    )}
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
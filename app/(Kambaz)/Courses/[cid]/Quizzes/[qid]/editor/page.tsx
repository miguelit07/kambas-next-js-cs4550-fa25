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
  Form,
  Nav,
  Tab,
  Alert,
  FloatingLabel,
} from "react-bootstrap";
import {
  findQuizById,
  updateQuiz,
  publishQuiz,
} from "@/app/(Kambaz)/Quizzes/client";
import { QuestionsTab } from "./QuestionsTab";

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
  choices?: { id: string; text: string; correct: boolean }[];
  correctAnswers?: string[];
  isEditing?: boolean;
  isNew?: boolean;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  quizType:
    | "GRADED_QUIZ"
    | "PRACTICE_QUIZ"
    | "GRADED_SURVEY"
    | "UNGRADED_SURVEY";
  points: number;
  assignmentGroup: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
  shuffleAnswers: boolean;
  timeLimit: number; // in minutes
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers:
    | "IMMEDIATELY"
    | "AFTER_LAST_ATTEMPT"
    | "NEVER"
    | "AFTER_DUE_DATE";
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

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState<Partial<Quiz>>({});
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Quizzes`);
      return;
    }

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await findQuizById(qid as string);
        setQuiz(quizData);
        setFormData({
          ...quizData,
          dueDate: quizData.dueDate
            ? new Date(quizData.dueDate).toISOString().slice(0, 16)
            : "",
          availableDate: quizData.availableDate
            ? new Date(quizData.availableDate).toISOString().slice(0, 16)
            : "",
          untilDate: quizData.untilDate
            ? new Date(quizData.untilDate).toISOString().slice(0, 16)
            : "",
        });
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
  }, [qid, isFaculty, router, cid]);

  const handleInputChange = (
    field: keyof Quiz,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionsUpdate = (questions: Question[]) => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    setFormData((prev) => ({
      ...prev,
      questions,
      points: totalPoints,
    }));
  };

  const handleLocalQuestionsChange = (questions: Question[]) => {
    setCurrentQuestions(questions);
  };

  const handleSave = async (shouldPublish = false) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Use current questions if they exist, otherwise fall back to formData questions
      const questionsToSave =
        currentQuestions.length > 0
          ? currentQuestions
          : formData.questions || [];
      const totalPoints = questionsToSave.reduce((sum, q) => sum + q.points, 0);

      const updateData = {
        ...formData,
        questions: questionsToSave,
        points: totalPoints,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
        availableDate: formData.availableDate
          ? new Date(formData.availableDate).toISOString()
          : null,
        untilDate: formData.untilDate
          ? new Date(formData.untilDate).toISOString()
          : null,
      };

      await updateQuiz(updateData);

      if (shouldPublish) {
        await publishQuiz(qid as string);
        setSuccess("Quiz saved and published successfully!");
        setTimeout(() => router.push(`/Courses/${cid}/Quizzes`), 1500);
      } else {
        setSuccess("Quiz saved successfully!");
        setTimeout(() => router.push(`/Courses/${cid}/Quizzes/${qid}`), 1500);
      }
    } catch (err: unknown) {
      console.error("Failed to save quiz:", err);
      setError("Failed to save quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
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

  if (error && !quiz) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Quiz Editor</h2>
              <p className="text-muted mb-0">
                {formData.title || "Unnamed Quiz"}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Points: {formData.points || 0}</span>
              <span
                className={`badge ${
                  formData.published ? "bg-success" : "bg-secondary"
                }`}
              >
                {formData.published ? "Published" : "Not Published"}
              </span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Tabs */}
      <Tab.Container
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
      >
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Details Tab */}
          <Tab.Pane eventKey="details">
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Quiz Details</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      {/* Title */}
                      <FloatingLabel label="Quiz Title" className="mb-3">
                        <Form.Control
                          type="text"
                          value={formData.title || ""}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          placeholder="Enter quiz title"
                        />
                      </FloatingLabel>

                      {/* Description */}
                      <FloatingLabel
                        label="Description (Optional)"
                        className="mb-3"
                      >
                        <Form.Control
                          as="textarea"
                          style={{ height: "100px" }}
                          value={formData.description || ""}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          placeholder="Enter quiz description"
                        />
                      </FloatingLabel>

                      {/* Quiz Type */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <FloatingLabel label="Quiz Type">
                            <Form.Select
                              value={formData.quizType || "GRADED_QUIZ"}
                              onChange={(e) =>
                                handleInputChange(
                                  "quizType",
                                  e.target.value as Quiz["quizType"]
                                )
                              }
                            >
                              <option value="GRADED_QUIZ">Graded Quiz</option>
                              <option value="PRACTICE_QUIZ">
                                Practice Quiz
                              </option>
                              <option value="GRADED_SURVEY">
                                Graded Survey
                              </option>
                              <option value="UNGRADED_SURVEY">
                                Ungraded Survey
                              </option>
                            </Form.Select>
                          </FloatingLabel>
                        </Col>
                        <Col md={6}>
                          <FloatingLabel label="Assignment Group">
                            <Form.Select
                              value={formData.assignmentGroup || "QUIZZES"}
                              onChange={(e) =>
                                handleInputChange(
                                  "assignmentGroup",
                                  e.target.value as Quiz["assignmentGroup"]
                                )
                              }
                            >
                              <option value="QUIZZES">Quizzes</option>
                              <option value="EXAMS">Exams</option>
                              <option value="ASSIGNMENTS">Assignments</option>
                              <option value="PROJECT">Project</option>
                            </Form.Select>
                          </FloatingLabel>
                        </Col>
                      </Row>

                      {/* Points and Time Limit */}
                      <Row className="mb-3">
                        <Col md={6}>
                          <FloatingLabel label="Points">
                            <Form.Control
                              type="number"
                              min="0"
                              value={formData.points || 0}
                              onChange={(e) =>
                                handleInputChange(
                                  "points",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="Total points"
                            />
                          </FloatingLabel>
                        </Col>
                        <Col md={6}>
                          <FloatingLabel label="Time Limit (Minutes)">
                            <Form.Control
                              type="number"
                              min="1"
                              value={formData.timeLimit || 20}
                              onChange={(e) =>
                                handleInputChange(
                                  "timeLimit",
                                  parseInt(e.target.value) || 20
                                )
                              }
                              placeholder="Time limit in minutes"
                            />
                          </FloatingLabel>
                        </Col>
                      </Row>

                      {/* Access Code */}
                      <FloatingLabel
                        label="Access Code (Optional)"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          value={formData.accessCode || ""}
                          onChange={(e) =>
                            handleInputChange("accessCode", e.target.value)
                          }
                          placeholder="Enter access code"
                        />
                      </FloatingLabel>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Options */}
                <Card className="mt-3">
                  <Card.Header>
                    <h5 className="mb-0">Options</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          label="Shuffle Answers"
                          checked={formData.shuffleAnswers || false}
                          onChange={(e) =>
                            handleInputChange(
                              "shuffleAnswers",
                              e.target.checked
                            )
                          }
                          className="mb-3"
                        />
                        <Form.Check
                          type="checkbox"
                          label="One Question at a Time"
                          checked={formData.oneQuestionAtTime !== false}
                          onChange={(e) =>
                            handleInputChange(
                              "oneQuestionAtTime",
                              e.target.checked
                            )
                          }
                          className="mb-3"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Webcam Required"
                          checked={formData.webcamRequired || false}
                          onChange={(e) =>
                            handleInputChange(
                              "webcamRequired",
                              e.target.checked
                            )
                          }
                          className="mb-3"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Check
                          type="checkbox"
                          label="Multiple Attempts"
                          checked={formData.multipleAttempts || false}
                          onChange={(e) =>
                            handleInputChange(
                              "multipleAttempts",
                              e.target.checked
                            )
                          }
                          className="mb-3"
                        />
                        {formData.multipleAttempts && (
                          <FloatingLabel
                            label="How Many Attempts"
                            className="mb-3"
                          >
                            <Form.Control
                              type="number"
                              min="1"
                              max="10"
                              value={formData.howManyAttempts || 1}
                              onChange={(e) =>
                                handleInputChange(
                                  "howManyAttempts",
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </FloatingLabel>
                        )}
                        <Form.Check
                          type="checkbox"
                          label="Lock Questions After Answering"
                          checked={
                            formData.lockQuestionsAfterAnswering || false
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "lockQuestionsAfterAnswering",
                              e.target.checked
                            )
                          }
                          className="mb-3"
                        />
                      </Col>
                    </Row>

                    {/* Show Correct Answers */}
                    <FloatingLabel
                      label="Show Correct Answers"
                      className="mb-3"
                    >
                      <Form.Select
                        value={formData.showCorrectAnswers || "IMMEDIATELY"}
                        onChange={(e) =>
                          handleInputChange(
                            "showCorrectAnswers",
                            e.target.value as Quiz["showCorrectAnswers"]
                          )
                        }
                      >
                        <option value="IMMEDIATELY">Immediately</option>
                        <option value="AFTER_LAST_ATTEMPT">
                          After Last Attempt
                        </option>
                        <option value="AFTER_DUE_DATE">After Due Date</option>
                        <option value="NEVER">Never</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Card.Body>
                </Card>
              </Col>

              {/* Dates */}
              <Col lg={4}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Availability</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <FloatingLabel label="Available From" className="mb-3">
                        <Form.Control
                          type="datetime-local"
                          value={formData.availableDate || ""}
                          onChange={(e) =>
                            handleInputChange("availableDate", e.target.value)
                          }
                        />
                      </FloatingLabel>

                      <FloatingLabel label="Due Date" className="mb-3">
                        <Form.Control
                          type="datetime-local"
                          value={formData.dueDate || ""}
                          onChange={(e) =>
                            handleInputChange("dueDate", e.target.value)
                          }
                        />
                      </FloatingLabel>

                      <FloatingLabel label="Available Until" className="mb-3">
                        <Form.Control
                          type="datetime-local"
                          value={formData.untilDate || ""}
                          onChange={(e) =>
                            handleInputChange("untilDate", e.target.value)
                          }
                        />
                      </FloatingLabel>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Assign To */}
                <Card className="mt-3">
                  <Card.Header>
                    <h5 className="mb-0">Assign</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                      <span>Everyone</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-muted p-0"
                      >
                        ×
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="mt-2 p-0 text-decoration-none"
                    >
                      + Add
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Questions Tab */}
          <Tab.Pane eventKey="questions">
            <QuestionsTab
              questions={formData.questions || []}
              onUpdateQuestions={handleQuestionsUpdate}
              onLocalQuestionsChange={handleLocalQuestionsChange}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 mb-4">
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="success"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          {saving ? "Publishing..." : "Save & Publish"}
        </Button>
      </div>
    </Container>
  );
}

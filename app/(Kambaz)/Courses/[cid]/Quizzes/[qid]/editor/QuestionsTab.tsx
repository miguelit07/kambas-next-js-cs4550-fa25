import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Alert,
  FloatingLabel,
  InputGroup
} from "react-bootstrap";
import { FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";

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
  isEditing?: boolean;
  isNew?: boolean;
}

interface QuestionEditorProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  onDelete: (questionId: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  onSave, 
  onCancel, 
  onDelete 
}) => {
  const [formData, setFormData] = useState<Question>({
    ...question,
    choices: question.choices || [
      { id: "1", text: "", correct: true },
      { id: "2", text: "", correct: false },
      { id: "3", text: "", correct: false },
      { id: "4", text: "", correct: false }
    ]
  });

  const handleInputChange = (field: keyof Question, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChoiceChange = (choiceId: string, field: "text" | "correct", value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      choices: prev.choices?.map(choice =>
        choice.id === choiceId ? { ...choice, [field]: value } : choice
      )
    }));
  };

  const handleQuestionTypeChange = (type: Question["questionType"]) => {
    let newChoices: Choice[] = [];
    
    switch (type) {
      case "TRUE_FALSE":
        newChoices = [
          { id: "true", text: "True", correct: true },
          { id: "false", text: "False", correct: false }
        ];
        break;
      case "MULTIPLE_CHOICE":
        newChoices = [
          { id: "1", text: "", correct: true },
          { id: "2", text: "", correct: false },
          { id: "3", text: "", correct: false },
          { id: "4", text: "", correct: false }
        ];
        break;
      case "FILL_IN_THE_BLANK":
        newChoices = [];
        break;
    }

    setFormData(prev => ({
      ...prev,
      questionType: type,
      choices: newChoices,
      correctAnswers: type === "FILL_IN_THE_BLANK" ? [] : undefined
    }));
  };

  const addChoice = () => {
    if (formData.choices && formData.choices.length < 10) {
      const newChoice: Choice = {
        id: Date.now().toString(),
        text: "",
        correct: false
      };
      setFormData(prev => ({
        ...prev,
        choices: [...(prev.choices || []), newChoice]
      }));
    }
  };

  const removeChoice = (choiceId: string) => {
    if (formData.choices && formData.choices.length > 2) {
      setFormData(prev => ({
        ...prev,
        choices: prev.choices?.filter(choice => choice.id !== choiceId)
      }));
    }
  };

  const handleCorrectAnswersChange = (value: string) => {
    const answers = value.split(',').map(answer => answer.trim()).filter(answer => answer);
    setFormData(prev => ({
      ...prev,
      correctAnswers: answers
    }));
  };

  const handleSave = () => {
    const savedQuestion = {
      ...formData,
      isEditing: false,
      isNew: false
    };
    onSave(savedQuestion);
  };

  return (
    <Card className="mb-3 border-primary">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaGripVertical className="text-muted me-2" />
            <span className="fw-bold">
              {question.isNew ? "New Question" : `Question ${question.title || "Untitled"}`}
            </span>
            <Badge bg="secondary" className="ms-2">{formData.points} pts</Badge>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(question._id)}>
              <FaTrash />
            </Button>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body>
        <Form>
          {/* Question Title and Points */}
          <Row className="mb-3">
            <Col md={8}>
              <FloatingLabel label="Question Title">
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter question title"
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel label="Points">
                <Form.Control
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.points}
                  onChange={(e) => handleInputChange("points", parseFloat(e.target.value) || 0)}
                  placeholder="Points"
                />
              </FloatingLabel>
            </Col>
          </Row>

          {/* Question Type */}
          <Row className="mb-3">
            <Col md={6}>
              <FloatingLabel label="Question Type">
                <Form.Select
                  value={formData.questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value as Question["questionType"])}
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>

          {/* Question Text */}
          <FloatingLabel label="Question Text" className="mb-3">
            <Form.Control
              as="textarea"
              style={{ height: "120px" }}
              value={formData.questionText}
              onChange={(e) => handleInputChange("questionText", e.target.value)}
              placeholder="Enter your question here..."
            />
          </FloatingLabel>

          {/* Answer Choices for Multiple Choice and True/False */}
          {(formData.questionType === "MULTIPLE_CHOICE" || formData.questionType === "TRUE_FALSE") && (
            <div className="mb-3">
              <h6>Answer Choices:</h6>
              {formData.choices?.map((choice, index) => (
                <div key={choice.id || `choice-${index}`} className="mb-2">
                  <InputGroup>
                    <InputGroup.Text>
                      <Form.Check
                        type="radio"
                        name={`correct-${question._id}`}
                        checked={choice.correct}
                        onChange={(e) => {
                          // Only one choice can be correct for single-answer questions
                          setFormData(prev => ({
                            ...prev,
                            choices: prev.choices?.map(c => ({
                              ...c,
                              correct: c.id === choice.id ? e.target.checked : false
                            }))
                          }));
                        }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={choice.text}
                      onChange={(e) => handleChoiceChange(choice.id, "text", e.target.value)}
                      placeholder={`Choice ${index + 1}`}
                      disabled={formData.questionType === "TRUE_FALSE"}
                    />
                    {formData.questionType === "MULTIPLE_CHOICE" && formData.choices && formData.choices.length > 2 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeChoice(choice.id)}
                      >
                        ✕
                      </Button>
                    )}
                  </InputGroup>
                </div>
              ))}
              
              {formData.questionType === "MULTIPLE_CHOICE" && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addChoice}
                  disabled={formData.choices && formData.choices.length >= 10}
                >
                  + Add Choice
                </Button>
              )}
            </div>
          )}

          {/* Correct Answers for Fill in the Blank */}
          {formData.questionType === "FILL_IN_THE_BLANK" && (
            <div className="mb-3">
              <FloatingLabel label="Correct Answers (comma-separated)">
                <Form.Control
                  type="text"
                  value={formData.correctAnswers?.join(", ") || ""}
                  onChange={(e) => handleCorrectAnswersChange(e.target.value)}
                  placeholder="Enter correct answers, separated by commas"
                />
              </FloatingLabel>
              <Form.Text className="text-muted">
                Enter multiple acceptable answers separated by commas (e.g., &quot;answer1, answer2, answer3&quot;)
              </Form.Text>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="outline-secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Question
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  questionNumber, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="mb-3">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaGripVertical className="text-muted me-2" />
            <span className="fw-bold">Question {questionNumber}</span>
            <Badge bg="secondary" className="ms-2">{question.points} pts</Badge>
            <Badge bg="info" className="ms-2">{question.questionType.replace(/_/g, " ")}</Badge>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => onEdit(question._id)}>
              <FaEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(question._id)}>
              <FaTrash />
            </Button>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body>
        <h6>{question.title}</h6>
        <p>{question.questionText}</p>
        
        {question.choices && question.choices.length > 0 && (
          <div>
            <strong>Choices:</strong>
            <ul className="mt-2">
              {question.choices.map((choice, index) => (
                <li key={choice.id || `choice-${index}`} className={choice.correct ? "fw-bold text-success" : ""}>
                  {choice.text} {choice.correct && "✓"}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {question.correctAnswers && question.correctAnswers.length > 0 && (
          <div>
            <strong>Correct Answers:</strong>
            <p className="text-success">{question.correctAnswers.join(", ")}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

interface QuestionsTabProps {
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onLocalQuestionsChange?: (questions: Question[]) => void;
}

export const QuestionsTab: React.FC<QuestionsTabProps> = ({ 
  questions, 
  onUpdateQuestions,
  onLocalQuestionsChange
}) => {
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);
  const [hasChanges, setHasChanges] = useState(false);

  const totalPoints = localQuestions.reduce((sum, q) => sum + q.points, 0);

  // Notify parent of local question changes
  useEffect(() => {
    if (onLocalQuestionsChange) {
      onLocalQuestionsChange(localQuestions);
    }
  }, [localQuestions, onLocalQuestionsChange]);

  const addNewQuestion = () => {
    const newQuestion: Question = {
      _id: `temp_${Date.now()}`,
      title: `Question ${localQuestions.length + 1}`,
      points: 1,
      questionText: "",
      questionType: "MULTIPLE_CHOICE",
      choices: [
        { id: "1", text: "", correct: true },
        { id: "2", text: "", correct: false },
        { id: "3", text: "", correct: false },
        { id: "4", text: "", correct: false }
      ],
      isEditing: true,
      isNew: true
    };
    
    setLocalQuestions([...localQuestions, newQuestion]);
    setHasChanges(true);
  };

  const handleQuestionSave = (savedQuestion: Question) => {
    setLocalQuestions(prev => 
      prev.map(q => q._id === savedQuestion._id ? savedQuestion : q)
    );
    setHasChanges(true);
  };

  const handleQuestionEdit = (questionId: string) => {
    setLocalQuestions(prev =>
      prev.map(q => q._id === questionId ? { ...q, isEditing: true } : q)
    );
  };

  const handleQuestionCancel = (questionId: string) => {
    const question = localQuestions.find(q => q._id === questionId);
    if (question?.isNew) {
      // Remove new questions that were cancelled
      setLocalQuestions(prev => prev.filter(q => q._id !== questionId));
    } else {
      // Revert changes for existing questions
      setLocalQuestions(prev =>
        prev.map(q => q._id === questionId ? { ...q, isEditing: false } : q)
      );
    }
  };

  const handleQuestionDelete = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setLocalQuestions(prev => prev.filter(q => q._id !== questionId));
      setHasChanges(true);
    }
  };

  const handleSaveAll = () => {
    onUpdateQuestions(localQuestions);
    setHasChanges(false);
  };

  return (
    <div>
      {/* Header with Total Points */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Quiz Questions</h5>
              <small className="text-muted">
                {localQuestions.length} question{localQuestions.length !== 1 ? 's' : ''} • {totalPoints} total points
              </small>
            </div>
            <div className="d-flex gap-2">
              {hasChanges && (
                <Button variant="success" onClick={handleSaveAll}>
                  Save Changes
                </Button>
              )}
              <Button variant="primary" onClick={addNewQuestion}>
                + New Question
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Changes Alert */}
      {hasChanges && (
        <Alert variant="warning" className="mb-3">
          <strong>Unsaved Changes:</strong> You have made changes to the questions. Don&apos;t forget to save your changes.
        </Alert>
      )}

      {/* Questions List */}
      {localQuestions.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No Questions Yet</h5>
            <p className="text-muted mb-4">Start building your quiz by adding questions.</p>
            <Button variant="primary" onClick={addNewQuestion}>
              Add Your First Question
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>
          {localQuestions.map((question, index) => (
            question.isEditing ? (
              <QuestionEditor
                key={question._id}
                question={question}
                onSave={handleQuestionSave}
                onCancel={() => handleQuestionCancel(question._id)}
                onDelete={handleQuestionDelete}
              />
            ) : (
              <QuestionDisplay
                key={question._id}
                question={question}
                questionNumber={index + 1}
                onEdit={handleQuestionEdit}
                onDelete={handleQuestionDelete}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};
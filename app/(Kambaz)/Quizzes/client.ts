/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const COURSES_API = `${HTTP_SERVER}/api/courses`;
export const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

// Get all quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

// Get a specific quiz by ID
export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Create a new quiz (Faculty only)
export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

// Update a quiz (Faculty only)
export const updateQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

// Delete a quiz (Faculty only)
export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Publish a quiz (Faculty only)
export const publishQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`);
  return response.data;
};

// Unpublish a quiz (Faculty only)
export const unpublishQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/unpublish`);
  return response.data;
};
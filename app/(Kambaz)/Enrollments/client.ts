import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export const enrollInCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.post(`${HTTP_SERVER}/api/courses/${courseId}/enrollments`);
  return response.data;
};

export const unenrollFromCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.delete(`${HTTP_SERVER}/api/courses/${courseId}/enrollments`);
  return response.data;
};

export const findMyEnrollments = async () => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/users/current/enrollments`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/users/${userId}/enrollments`);
  return response.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/courses/${courseId}/enrollments`);
  return response.data;
};

export const findAllEnrollments = async () => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/enrollments`);
  return response.data;
};
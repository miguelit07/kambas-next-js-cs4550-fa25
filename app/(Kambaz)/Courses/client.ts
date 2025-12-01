/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const COURSES_API = `${HTTP_SERVER}/api/courses`;
export const USERS_API = `${HTTP_SERVER}/api/users`;

export const findAllCourses = async () => {
  const response = await axiosWithCredentials.get(COURSES_API);
  return response.data;
};

export const findMyCourses = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};


export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const deleteModule = async (moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(`${HTTP_SERVER}/api/modules/${moduleId}`);
  return data;
};

export const updateModule = async (module: any) => {
  const { data } = await axiosWithCredentials.put(`${HTTP_SERVER}/api/modules/${module._id}`, module);
  return data;
};
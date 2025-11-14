import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/[cid]/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer";
import enrollmentsReducer from "./Enrollments/reducer";

const store = configureStore({
  reducer: { coursesReducer, modulesReducer, accountReducer, assignmentsReducer, enrollmentsReducer },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;

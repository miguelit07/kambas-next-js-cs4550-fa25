import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action) => {
      state.quizzes = [...state.quizzes, action.payload];
    },
    updateQuiz: (state, action) => {
      state.quizzes = state.quizzes.map((quiz: any) =>
        quiz._id === action.payload._id ? action.payload : quiz
      );
    },
    deleteQuiz: (state, action) => {
      state.quizzes = state.quizzes.filter((quiz: any) => quiz._id !== action.payload);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
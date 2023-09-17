import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.module.css";
import Root from "./routes/root";
import ErrorPage from "./htmlAssets/ErrorPage/ErrorPage";
import All from "./routes/All/all";
import Login from "./routes/Login/Login";
import Register from "./routes/Register/Register";
import Categories from "./routes/Categories/Categories";
// import Task from "./htmlAssets/Task/Task";
import Todays from "./routes/Todays/Todays";
import Schedule from "./routes/Schedule/schedule";
import Completed from "./routes/Completed/Completed";
import Uncompleted from "./routes/Uncompleted/Uncompleted";
// import CreateCategory from './routes/Categories/CreateCategory'

// Check if the token exists in local storage
if (!localStorage.getItem("token")) {
  // If it doesn't exist, set a default token value
  localStorage.setItem("token", '');
}

// Check if other items exist in local storage and set defaults if needed
if (!localStorage.getItem("ActiveUser")) {
  // Set a default ActiveUser object
  const defaultActiveUser = {
    UserName: "ゲスト",
    UserID: null,
  };
  localStorage.setItem("ActiveUser", JSON.stringify(defaultActiveUser));
}

if (!localStorage.getItem("tasks")) {
  // Set a default tasks array if needed
  const defaultTask = {
    TaskID: 1, // タスクのユニークな識別子
    UserID: null, // ユーザーID（ゲストユーザーの場合はnull）
    CategoryID: 1, // カテゴリーのID（適切なカテゴリーに割り当ててください）
    TaskName: "サンプルタスク", // タスクの名前
    Description: "これはサンプルタスクです。", // タスクの説明
    Priority: "低", // タスクの優先度（例: 低、中、高）
    Deadline: "2023-09-30", // タスクの締め切り日（ISO形式: YYYY-MM-DD）
    // 他のタスクのプロパティを必要に応じて追加してください
  };

  // このデフォルトタスクをローカルストレージに保存できます：
  localStorage.setItem("tasks", JSON.stringify([defaultTask])); // Store sample task in tasks table
}

const defaultCategory = {
  CategoryID: 1,
  CategoryName: "デフォルト",
};

// このデフォルトカテゴリーをローカルストレージに保存できます：
localStorage.setItem("categories", JSON.stringify([defaultCategory]));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage message="Page Not Found!" />,
    children: [
      {
        path: "/",
        element: <All />,
      },
      {
        path: "/today",
        element: <Todays />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/completed",
        element: <Completed />,
      },
      {
        path: "/uncompleted",
        element: <Uncompleted />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
    ],
  },

  {
    path: "/category",
    element: <Categories />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

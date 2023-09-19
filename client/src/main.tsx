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
  localStorage.setItem("token", "");
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

// Check if the "categories" and "tasks" tables exist in local storage
let categories = localStorage.getItem("categories") || "";
let tasks = localStorage.getItem("tasks") || "";

if (!categories) {
  // Categories table doesn't exist, create it with the default category
  let category = [
    {
      CategoryID: 1,
      CategoryName: "デフォルト",
    },
  ];
  localStorage.setItem("categories", JSON.stringify(category));
}

if (!tasks) {
  // Tasks table doesn't exist, create it with the sample task
  let task = [
    {
      TaskID: 1,
      CategoryID: 1, // CategoryID for the default category
      TaskName: "サンプル",
      Description: "This is a sample task description.",
      Priority: "優先",
      Deadline: "2023-09-14 04:00:00", // Replace with the actual deadline
      Completed: 0, // 0 for not completed, 1 for completed
      CompletedDate: null, // Set to null for not completed, or provide a timestamp for completed
    },
  ];
  localStorage.setItem("tasks", JSON.stringify(task));
}

const router = createBrowserRouter([
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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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

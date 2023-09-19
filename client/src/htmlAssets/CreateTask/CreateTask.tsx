import React, { useCallback, useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import styles from "./createTask.module.css";

import axios from "axios";
import * as qs from "qs";
import toastr from "toastr";
import "toastr/toastr.scss";

interface Task {
  title: string;
  description: string;
  priority: string;
  category: number; // Change category to use number (ID)
  repetition: string;
  deadline: string;
  TaskID: any;
}

interface Category {
  CategoryID: number;
  CategoryName: string;
}

interface CreateTaskProps {
  updateTaskData: (newTask: Task) => void;
  TaskID: any;
  TaskIDNull: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  updateTaskData,
  TaskID,
  TaskIDNull,
}) => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 9);

  const currentDateString = currentDate.toISOString().split("T")[0];
  const [categories, setCategories] = useState<Category[]>([]);

  // Move this part inside the useEffect
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    priority: "普通",
    category: getCategoriesFromLocalStorage()[0].CategoryID,
    repetition: "onetime",
    deadline: currentDateString,
    TaskID: TaskID,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const activeUserJSON = localStorage.getItem("ActiveUser");
    const user = JSON.parse(activeUserJSON || "{}");
    if (user.UserID == null) {
      // User is a guest, fetch categories from local storage
      const categoriesFromLocalStorage = getCategoriesFromLocalStorage();
      setCategories(categoriesFromLocalStorage);

      setTask((prevTask) => ({
        ...prevTask,
        category: categoriesFromLocalStorage[0].CategoryID,
      }));
    } else {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: window.location.origin + "/api/categories",
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      axios
        .request(config)
        .then((response) => {
          const fetchedCategories = response.data;
          setCategories(fetchedCategories);
          // const defaultCategory = fetchedCategories.length > 0 ? fetchedCategories[0].CategoryID : 0; // Use CategoryID
          setTask((prevTask) => ({
            ...prevTask,
            category:
              fetchedCategories.length > 0
                ? fetchedCategories[0].CategoryID
                : 0,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleReset = () => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9);

    const currentDateString = currentDate.toISOString().split("T")[0];
    setTask({
      title: "",
      description: "",
      priority: "普通",
      category: task.category, // Use defaultCategory (ID)
      repetition: "onetime",
      deadline: currentDateString,
      TaskID: undefined, // Reset TaskID to undefined
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue = name === "category" ? parseInt(value, 10) : value; // Convert to a number if the input is category
    setTask((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const activeUserJSON = localStorage.getItem("ActiveUser");
    const user = JSON.parse(activeUserJSON || "{}");
    if (user.UserID === null) {
      addTaskToLocalstorage(task);
      handleReset();
      toastr.success("タスクが作成されました");
      updateTaskData(task);
    } else {
      const date = new Date().toJSON().slice(0, 10);
      let data = qs.stringify({
        taskName: task.title,
        categoryID: task.category,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline || date,
      });

      const token = localStorage.getItem("token");
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: window.location.origin + "/api/task",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + token,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          handleReset();
          toastr.success("タスクが作成されました");
          const newTask = response.data as Task;
          updateTaskData(newTask);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (TaskID === null) {
      handleReset();
    }
  }, [TaskID]);

  const handleUpdate = (taskID: any) => {
    const updatedTask = {
      title: task.title,
      category: task.category,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
    };

    const user = JSON.parse(localStorage.getItem("ActiveUser") as string);

    if (user.UserID == null) {
      // User is a guest, update the task in local storage
      updateTaskInLocalStorage(taskID, updatedTask);
      updateTaskData(task);

      // Trigger data update (you should implement this function)
      // updateTaskDataInLocalStorage(updatedTask);

      // Reset form or perform other actions as needed
      handleReset();
      toastr.success("タスクが更新されました");
      TaskIDNull();
    } else {
      // User is not a guest, make an API request as before
      let data = qs.stringify({
        taskName: task.title,
        categoryName: task.category,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
      });

      const token = localStorage.getItem("token");
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: window.location.origin + "/api/tasks/" + TaskID,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + token,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          // Trigger data update (you should implement this function)
          // updateTaskData(response.data);

          // Reset form or perform other actions as needed
          handleReset();
          toastr.success("タスクが更新されました");
          const newTask = response.data as Task;
          updateTaskData(newTask);
          TaskIDNull();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const setUpdateData = useCallback(
    (taskID: any) => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("ActiveUser") as string);

      if (user.UserID == null) {
        // User is a guest, fetch task data from local storage
        const taskData = getTaskFromLocalStorage(taskID);
        if (taskData) {
          const formattedDate = format(
            new Date(taskData.Deadline),
            "yyyy-MM-dd"
          );
          setTask({
            title: taskData.TaskName,
            description: taskData.Description,
            priority: taskData.Priority,
            category: taskData.CategoryID, // Use CategoryID
            repetition: "onetime",
            deadline: formattedDate,
            TaskID: taskID,
          });

          const inputTitle = formRef.current?.querySelector(
            "#inputTitle"
          ) as HTMLInputElement | null;
          if (inputTitle) {
            inputTitle.focus();
          }
        }
      } else {
        // User is not a guest, make an API request
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: window.location.origin + "/api/tasks/" + taskID,
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        axios
          .request(config)
          .then((response) => {
            const formattedDate = format(
              new Date(response.data.Deadline),
              "yyyy-MM-dd"
            );
            setTask({
              title: response.data.TaskName,
              description: response.data.Description,
              priority: response.data.Priority,
              category: response.data.CategoryID, // Use CategoryID
              repetition: "onetime",
              deadline: formattedDate,
              TaskID: taskID,
            });

            const inputTitle = formRef.current?.querySelector(
              "#inputTitle"
            ) as HTMLInputElement | null;
            if (inputTitle) {
              inputTitle.focus();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [setTask, formRef]
  );

  useEffect(() => {
    if (TaskID !== null) {
      setUpdateData(TaskID);
    }
  }, [TaskID, setUpdateData]);

  return (
    <div className={styles.noselect}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className={styles.createTaskContainer}>
          <div className={styles.taskTitleForm}>
            <div className={styles.taskTitle}>
              <div className={styles.wrapper}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 0.8125C3.35887 0.8125 0.8125 3.35887 0.8125 6.5C0.8125 9.64112 3.35887 12.1875 6.5 12.1875C9.64112 12.1875 12.1875 9.64112 12.1875 6.5C12.1875 3.35887 9.64112 0.8125 6.5 0.8125ZM0 6.5C0 2.91015 2.91015 0 6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5Z"
                    fill="#212121"
                  />
                </svg>
                <div className={styles.inputData}>
                  <input
                    id="inputTitle"
                    className={styles.input}
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleInputChange}
                    required
                  />
                  <div className={styles.underline}></div>
                  <label className={styles.label}>
                    タイトルを入力してください
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.taskDescriptionContainer}>
              <textarea
                className={styles.taskDescription}
                name="description"
                value={task.description}
                onChange={handleInputChange}
                placeholder="タスクの詳細を入力する"
              ></textarea>
            </div>
          </div>

          <div className={styles.taskDetailsForm}>
            <div className={styles.priorityCategoryRepetition}>
              <label className={styles.label} htmlFor="task-priority">
                タスクの優先度
              </label>
              <select
                className={styles.formSelect}
                id="taskPriority"
                name="priority"
                value={task.priority}
                onChange={handleInputChange}
              >
                <option className={styles.option} value="低い">
                  低い
                </option>
                <option className={styles.option} value="普通">
                  普通
                </option>
                <option className={styles.option} value="優先">
                  優先
                </option>
              </select>
              <label className={styles.label} htmlFor="task-category">
                タスクのカテゴリー
              </label>
              {categories.length > 0 && (
                <select
                  className={styles.formSelect}
                  id="taskCategory"
                  name="category"
                  value={task.category}
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <option
                      key={category.CategoryID}
                      className={styles.option}
                      value={category.CategoryID} // Use CategoryID
                    >
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.weekdays}>
              <label className={styles.label} htmlFor="task-category">
                タスクの繰り返し
              </label>
              <select
                className={styles.formSelect}
                id="taskRepetition"
                name="repetition"
                value={task.repetition}
                onChange={handleInputChange}
              >
                <option className={styles.option} value="onetime">
                  一回のみ
                </option>
                <option className={styles.option} value="daily">
                  毎日
                </option>
                <option className={styles.option} value="weekly">
                  毎週
                </option>
              </select>
              <label className={styles.label} htmlFor="task-category">
                タスクの締め切り
              </label>
              <input
                type="date"
                id="taskDeadline"
                name="deadline"
                className={styles.formSelect}
                value={task.deadline}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.taskCreateOptions}>
            <button
              className={styles.btn + " " + styles.reset}
              type="reset"
              onClick={handleReset}
            >
              リセット
            </button>
            {/* <button className={styles.btn + " " + styles.delete}>
              
            </button> */}
            {TaskID ? (
              <button
                type="button"
                className={styles.btnLocal}
                onClick={() => handleUpdate(TaskID)}
              >
                更新
              </button>
            ) : (
              <button className={styles.btnLocal} type="submit">
                追加
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;

function getCategoriesFromLocalStorage() {
  try {
    // Retrieve categories from local storage
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    return categories;
  } catch (error) {
    console.error("Error retrieving categories from local storage:", error);
    return [];
  }
}

function addTaskToLocalstorage(taskData: any) {
  try {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    // Find the last task in the array to determine the next TaskID
    const lastTask = tasks[tasks.length - 1];
    const nextTaskID = lastTask ? lastTask.TaskID + 1 : 1;

    // Create a new task object using the provided data
    const newTask = {
      TaskID: nextTaskID, // Assign a unique ID
      CategoryID: taskData.category,
      TaskName: taskData.title,
      Description: taskData.description,
      Priority: taskData.priority,
      Deadline: taskData.deadline,
      Completed: 0,
      CompletedDate: null,

      // Add other task properties as needed
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Update the tasks in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error adding task to local storage:", error);
  }
}

function getTaskFromLocalStorage(taskID: any) {
  try {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Find the task with the specified ID
    const task = tasks.find((t: any) => t.TaskID === taskID);

    // If the task is found and it has a CategoryID
    if (task && task.CategoryID) {
      // Retrieve categories from local storage
      const categories = JSON.parse(localStorage.getItem("categories") || "[]");

      // Find the category with the matching CategoryID
      const category = categories.find(
        (c: any) => c.CategoryID === task.CategoryID
      );

      // Add CategoryName to the task object if category is found
      if (category) {
        task.CategoryName = category.CategoryName;
      }
    }

    return task || null; // Return the found task or null if not found
  } catch (error) {
    console.error("Error retrieving task from local storage:", error);
    return null;
  }
}

function updateTaskInLocalStorage(
  taskID: any,
  updatedTask: {
    title: string;
    category: number;
    description: string;
    priority: string;
    deadline: string;
  }
) {
  try {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Find the task with the specified ID
    const taskToUpdateIndex = tasks.findIndex((t: any) => t.TaskID === taskID);

    if (taskToUpdateIndex !== -1) {
      // Update the task properties
      tasks[taskToUpdateIndex].TaskName = updatedTask.title;
      tasks[taskToUpdateIndex].CategoryID = updatedTask.category;
      tasks[taskToUpdateIndex].Description = updatedTask.description;
      tasks[taskToUpdateIndex].Priority = updatedTask.priority;
      tasks[taskToUpdateIndex].Deadline = updatedTask.deadline;

      // Update the tasks array in local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      console.log("Task updated in local storage:", tasks[taskToUpdateIndex]);
    } else {
      console.log("Task with ID", taskID, "not found in local storage.");
    }
  } catch (error) {
    console.error("Error updating task in local storage:", error);
  }
}

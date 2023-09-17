import { useEffect, useState } from "react";
import all from "./all.module.css";
import "../general.css";

import axios from "axios";
import * as qs from "qs";
import Tasks from "../../htmlAssets/task/task";
import CreateTask from "../../htmlAssets/CreateTask/createTask/CreateTask";
import TaskDetails from "../../htmlAssets/details/details";
import {
  faArrowUpAZ,
  faMagnifyingGlass,
  faPlus,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let isOpen: boolean;
interface TaskData {
  TaskName: string;
  Description: string;
  Deadline: string;
  CategoryName: string;
  Priority: string;
  Completed: boolean;
  CompletedDate: string | null;
}

async function fetchTaskData() {
  const token = localStorage.getItem("token");

  // Check if the user is a guest (you can use your own condition)
  if (token === null || token === "guestToken") {
    // User is a guest, fetch data from local storage
    const tasksFromLocalStorage =
      getTodayTasksFromLocalStorageWithCategoryName();
    return tasksFromLocalStorage;
  }

  // User is authenticated, fetch data from the API
  const data = qs.stringify({});
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://" + window.location.hostname + ":3001/api/today",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    return response.data;
  } catch (error) {
    console.log("Error fetching task data:", error);
    throw error;
  }
}

export default function All() {
  const [currentTaskID, setCurrentTaskID] = useState<number | null>(null);
  const [taskdata, setTaskdata] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("TaskName"); // Default sorting criteria
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [taskdataDetail, setTaskdataDetail] = useState<TaskData>({
    TaskName: "",
    Description: "",
    Deadline: "",
    CategoryName: "",
    Priority: "",
    Completed: false,
    CompletedDate: null,
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const priorityOptions = ["低い", "普通", "優先"];
  const [categories, setCategories] = useState<[]>([]);

  const [formData, setFormData] = useState({
    // Your filter criteria state
    selectValue1: "",
    selectValue2: 0,
    inputValue: "",
  });

  const handleResetClick = () => {
    // Reset your filter criteria here
    setFormData({
      selectValue1: "",
      selectValue2: 0,
      inputValue: "",
    });

    updateTaskData();
    // You can also perform any other actions needed for resetting here
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGetButtonClick = () => {
    fetchTaskData().then((data) => {
      const filteredTasks = data.filter((task: any) => {
        console.log(task.Deadline.split(" ")[0]);
        // Check if selectValue1 matches task's priority (assuming task.priority is the attribute name)
        if (formData.selectValue1 && task.Priority != formData.selectValue1) {
          return false;
        }
        // Check if selectValue2 matches task's status (assuming task.status is the attribute name)
        if (formData.selectValue2 && task.CategoryID != formData.selectValue2) {
          return false;
        }

        // Check if inputValue matches task's due date (assuming task.dueDate is the attribute name)
        if (
          formData.inputValue &&
          task.Deadline.split(" ")[0] != formData.inputValue
        ) {
          return false;
        }

        // If none of the conditions failed, include the task in the filtered result
        return true;
      });

      // Set the filtered data back to the taskdata state variable
      setTaskdata(filteredTasks);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null || token === "guestToken") {
      // User is a guest, fetch categories from local storage
      const categoriesFromLocalStorage = getCategoriesFromLocalStorage();
      setCategories(categoriesFromLocalStorage);
    } else {
      // User is authenticated, fetch categories from the API
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://" + window.location.hostname + ":3001/api/categories",
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      axios
        .request(config)
        .then((response) => {
          const fetchedCategories = response.data;
          setCategories(fetchedCategories);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const openDetail = (TaskID: number) => {
    const token = localStorage.getItem("token");

    if (token === null || token === "guestToken") {
      // User is a guest, fetch task details from local storage
      const taskDetailFromLocalStorage = getTaskFromLocalStorage(TaskID);
      setTaskdataDetail(taskDetailFromLocalStorage);

      // Open the detail view
      setIsDetailOpen(true);
    } else {
      // User is authenticated, fetch task details from the API
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://" + window.location.hostname + ":3001/api/tasks/" + TaskID,
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      axios
        .request(config)
        .then((response) => {
          // Set the fetched data in the taskdataDetail state
          setTaskdataDetail(response.data);

          // Open the detail view
          setIsDetailOpen(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
  };

  // Function to update the taskdata state
  const updateTaskData = () => {
    // Fetch the latest data when a new task is created
    fetchTaskData()
      .then((data) => {
        setTaskdata(data);
      })
      .catch(() => {
        // Handle error if needed
      });
  };

  const setIDNull = () => {
    setCurrentTaskID(null);
  };

  const getUpdateData = (TaskID: number) => {
    setCurrentTaskID(TaskID);
    if (!isOpen) {
      openElement(false);
    }
    return TaskID;
  };

  useEffect(() => {
    fetchTaskData()
      .then((data) => {
        setTaskdata(data);
      })
      .catch(() => {
        // Handle error if needed
      });
  }, []);

  function openElement(isCreate: any) {
    const heightElement =
      document
        .getElementsByClassName("CreateTask")[0]
        .querySelectorAll("div")[1].clientHeight +
      4 +
      "px";
    if (isCreate) {
      setCurrentTaskID(null);
    }
    const createTaskElement = document.getElementsByClassName(
      "CreateTask"
    )[0] as HTMLElement | null;
    if (createTaskElement) {
      createTaskElement.style.height = heightElement;
    }

    setTimeout(() => {
      if (createTaskElement) {
        createTaskElement.style.height = "fit-content";
        createTaskElement.style.overflow = "unset";
      }
    }, 400);

    isOpen = true;
  }

  function closeElement() {
    const heightElement = document
      .getElementsByClassName("CreateTask")[0]
      .querySelectorAll("div")[1].clientHeight;

    const createTaskElement = document.getElementsByClassName(
      "CreateTask"
    )[0] as HTMLElement | null;
    if (createTaskElement) {
      createTaskElement.style.height = heightElement + 4 + "px";
    }

    setTimeout(() => {
      if (createTaskElement) {
        createTaskElement.style.height = "";
      }
    }, 1);
    if (createTaskElement) {
      createTaskElement.style.overflow = "hidden";
    }
    isOpen = false;
  }

  const handleSort = (criteria: any) => {
    // Toggle sorting order if the same criteria is clicked again
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a different criteria is clicked, reset the sorting order
      setSortOrder("asc");
    }
    setSortCriteria(criteria);

    // Sort the taskData array based on the selected criteria and order
    const sortedData = [...taskdata].sort((a: any, b: any) => {
      if (criteria === "TaskName") {
        // Sort by TaskName
        return a.TaskName.localeCompare(b.TaskName);
      } else if (criteria === "DueDate") {
        // Sort by DueDate
        const dateA = new Date(a.Deadline).getTime();
        const dateB = new Date(b.Deadline).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    // Update the state with the sorted array
    setTaskdata(sortedData);
  };

  return (
    <div className="content">
      <div className="top">
        <div className={all.GetButton}>
          <h1>今日のタスク</h1>
          <div className={all.buttons}>
            <div onClick={handleResetClick}>
              <FontAwesomeIcon icon={faRotate} />
            </div>
            <div onClick={handleGetButtonClick}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
          </div>
        </div>

        <div className="filters">
          {/* First Select */}
          <select
            className={all.formSelect}
            name="selectValue1"
            value={formData.selectValue1}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              優先度
            </option>
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Second Select */}
          <select
            className={all.formSelect}
            name="selectValue2"
            value={formData.selectValue2}
            onChange={handleInputChange}
          >
            <option value="0" disabled>
              カテゴリー
            </option>
            {categories.map((category: any) => (
              <option
                key={category.CategoryID}
                value={category.CategoryID} // Use CategoryID
              >
                {category.CategoryName}
              </option>
            ))}
          </select>

          {/* Input */}
          <input
            type="date"
            className={all.formSelect}
            name="inputValue"
            value={formData.inputValue}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div onClick={() => openElement(true)} className="float">
        <FontAwesomeIcon icon={faPlus} className="my-float" />
      </div>

      <div className="CreateTask" id="taskMenu">
        <div onClick={() => closeElement()} className="closeButton">
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="15"
              cy="15"
              r="12"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
            />

            <line
              x1="9"
              y1="9"
              x2="21"
              y2="21"
              stroke="#000000"
              strokeWidth="2"
            />
            <line
              x1="9"
              y1="21"
              x2="21"
              y2="9"
              stroke="#000000"
              strokeWidth="2"
            />
          </svg>
        </div>
        {/* Pass the updateTaskData function as a prop to CreateTask */}
        <CreateTask
          updateTaskData={updateTaskData}
          TaskID={currentTaskID}
          TaskIDNull={setIDNull} // Pass currentTaskID
        />
      </div>

      {isDetailOpen && (
        <TaskDetails
          taskdata={taskdataDetail} // Pass the fetched data to TaskDetails
          onClose={closeDetail}
        />
      )}
      <div className={all.TaskContainer}>
        <div className={all.sortBar}>
          <button onClick={() => handleSort("TaskName")}>
            <FontAwesomeIcon icon={faArrowUpAZ} />
            タスク名
          </button>
        </div>
        <Tasks
          taskdata={taskdata}
          updateTaskData={updateTaskData}
          getUpdateData={getUpdateData}
          getDetails={openDetail} // Pass openDetail function to Tasks
        />
      </div>
    </div>
  );
}

function getTodayTasksFromLocalStorageWithCategoryName() {
  try {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Retrieve categories from local storage
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");

    const currentDate = new Date();

    // Adjust the date and time to Japan Standard Time (UTC+9)
    currentDate.setHours(currentDate.getHours() + 9);

    // Get today's date in ISO format (YYYY-MM-DD)
    const todayDate = currentDate.toISOString().split("T")[0];

    // Filter tasks that have a Deadline equal to today's date
    const todayTasks = tasks.filter((task:any) => {
      return task.Deadline && task.Deadline === todayDate; // Compare directly with todayDate
    });

    // Loop through filtered tasks and add CategoryName to each task
    const todayTasksWithCategoryName = todayTasks.map((task:any) => {
      if (task.CategoryID) {
        // Find the category with the matching CategoryID
        const category = categories.find(
          (c:any) => c.CategoryID === task.CategoryID
        );

        // If a matching category is found, add CategoryName to the task
        if (category) {
          task.CategoryName = category.CategoryName;
        }
      }
      return task;
    });

    return todayTasksWithCategoryName;
  } catch (error) {
    console.error("Error retrieving tasks from local storage:", error);
    return [];
  }
}

function getTaskFromLocalStorage(taskID: any) {
  try {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Find the task with the specified ID
    const task = tasks.find((t:any) => t.TaskID === taskID);
    console.log(task);
    // If the task is found and it has a CategoryID
    if (task && task.CategoryID) {
      // Retrieve categories from local storage
      const categories = JSON.parse(localStorage.getItem("categories") || "[]");

      // Find the category with the matching CategoryID
      const category = categories.find((c:any) => c.CategoryID === task.CategoryID);

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

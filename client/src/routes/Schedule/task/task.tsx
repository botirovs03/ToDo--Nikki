import React from "react";
import axios from "axios";
import "../../general.css";
import st from "./task.module.css";
import { format } from "date-fns";

interface Task {
  Priority: "低い" | "普通" | "優先";
  Completed: boolean;
  TaskID: number;
  CategoryName: string;
  TaskName: string;
  Deadline: string;
}

const priorityClassMap = {
  低い: "low",
  普通: "normal",
  優先: "critical",
};


interface TasksProps {
  taskdata: Task[];
  updateTaskData: () => void;
  getUpdateData: (TaskID: number) => void; // Correctly define the type of getUpdateData
  getDetails: (TaskID: number) => void;
}

export default function Tasks({
  taskdata,
  updateTaskData,
  getUpdateData,
  getDetails,
}: TasksProps): JSX.Element {
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const localDate = format(date, "yyyy-MM-dd");
    return localDate;
  };

  // Group tasks by deadline date
  const groupedTasks: Record<string, Task[]> = {};
  taskdata.forEach((task) => {
    const deadlineDate = formatDeadline(task.Deadline);
    if (!groupedTasks[deadlineDate]) {
      groupedTasks[deadlineDate] = [];
    }
    groupedTasks[deadlineDate].push(task);
  });

  const handleDelete = (
    TaskID: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.stopPropagation();

    const activeUserJSON = localStorage.getItem("ActiveUser");
    const activeUser = activeUserJSON ? JSON.parse(activeUserJSON) : null;
    const isGuest = activeUser ? activeUser.UserID === null : true;

    if (isGuest) {
      // User is a guest, delete from local storage
      deleteTaskById(TaskID); // Use the deleteTaskById function from the previous response
      updateTaskData(); // Trigger data update after deletion
    } else {
      // User is authenticated, send a request to delete from the API
      const token = localStorage.getItem("token");
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: "http://" + window.location.hostname + ":3001/api/tasks/" + TaskID,
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          updateTaskData(); // Trigger data update after successful deletion
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function handleChange(
    TaskID: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    event.stopPropagation();
    getUpdateData(TaskID);
  }

  function taskComplete(
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    TaskID: number
  ): void {
    event.stopPropagation();
    // Check if the user is a guest
    const isGuest =
      localStorage.getItem("ActiveUser") ===
      '{"UserName":"ゲスト","UserID":null}';

    if (isGuest) {
      // User is a guest, toggle the completed status in local storage
      toggleTaskCompletedStatus(TaskID);
      // Update the UI or perform any other actions as needed
      updateTaskData();
    } else {
      // User is not a guest, send a request to the API to toggle the completed status
      const token = localStorage.getItem("token");
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url:
          "http://" +
          window.location.hostname +
          ":3001/api/tasks/" +
          TaskID +
          "/complete",
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      axios
        .request(config)
        .then(() => {
          // Update the UI or perform any other actions as needed
          updateTaskData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function nonClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ): void {
    event.stopPropagation();
  }

  const TaskItems = Object.keys(groupedTasks).map((deadlineDate: string) => (
    <div key={deadlineDate}>
      <div className="date-heading">{deadlineDate}</div>
      {groupedTasks[deadlineDate].map((taskdatas: Task, index: number) => (
        <div key={index} onClick={() => getDetails(taskdatas.TaskID)}>
          <span
            className={
              st.taskFold +
              " " +
              st[
                priorityClassMap[
                  taskdatas.Priority as keyof typeof priorityClassMap
                ]
              ]
            }
            onClick={(event) => nonClick(event)}
          >
            {taskdatas.CategoryName}
          </span>
          <div key={taskdatas.TaskID} className={st.task}>
            <div className={st.title}>
              <svg
                onClick={(event) => taskComplete(event, taskdatas.TaskID)}
                width="25"
                height="25"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "inline" }}
              >
                {/* Circle */}
                <path
                  d="M6.5 0.8125C3.35887 0.8125 0.8125 3.35887 0.8125 6.5C0.8125 9.64112 3.35887 12.1875 6.5 12.1875C9.64112 12.1875 12.1875 9.64112 12.1875 6.5C12.1875 3.35887 9.64112 0.8125 6.5 0.8125ZM0 6.5C0 2.91015 2.91015 0 6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5Z"
                  fill="#212121"
                />

                {/* Checkmark (Tick) */}
                {taskdatas.Completed ? (
                  <path
                    d="M2 6.3L4.6 9.3L11.4 2"
                    stroke="green"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
              </svg>

              <div className={st.text}>{taskdatas.TaskName}</div>
            </div>

            <div className={st.right}>
              <div className={st.deadline}>
                {formatDeadline(taskdatas.Deadline)}
              </div>
              <div className={st.buttons}>
                <div className={st.details}>詳細</div>
                <div
                  className={st.update}
                  onClick={(event) => handleChange(taskdatas.TaskID, event)}
                >
                  更新
                </div>
                <div
                  className={st.delete}
                  onClick={(event) => handleDelete(taskdatas.TaskID, event)}
                >
                  削除
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ));

  return <div>{TaskItems}</div>;
}

function deleteTaskById(taskID: any) {
  try {
    // Retrieve tasks from local storage
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Find the index of the task with the specified ID
    const taskIndex = tasks.findIndex((t:any) => t.TaskID === taskID);

    if (taskIndex !== -1) {
      // If the task was found, remove it from the tasks array
      tasks.splice(taskIndex, 1);

      // Update the tasks in local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      console.log(`Task with ID ${taskID} has been deleted.`);
    } else {
      console.log(`Task with ID ${taskID} not found.`);
    }
  } catch (error) {
    console.error("Error deleting task from local storage:", error);
  }
}

function toggleTaskCompletedStatus(TaskID:any) {
  try {
    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Find the task with the specified ID
    const taskIndex = tasks.findIndex((t:any) => t.TaskID === TaskID);

    if (taskIndex !== -1) {
      // Task found in local storage, toggle its completed status
      tasks[taskIndex].Completed = !tasks[taskIndex].Completed;

      // Set the completed date
      if (tasks[taskIndex].Completed) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        tasks[taskIndex].CompletedDate = formattedDate;
      } else {
        // If the task is marked as not completed, clear the completed date
        tasks[taskIndex].CompletedDate = null;
      }

      // Update the tasks in local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  } catch (error) {
    console.error("Error toggling task completed status:", error);
  }
}

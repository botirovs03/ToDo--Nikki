import { useState, useEffect } from "react";
import "./style.css";
import logo from "./logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUserSecret,
  faRightToBracket,
  faChevronRight,
  faList,
  faCalendarDay,
  faRotateRight,
  faThumbsUp,
  faBoxOpen,
  faRightFromBracket,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import CurrentDate from "../Date";
import { Outlet } from "react-router-dom";

interface UserData {
  UserName: string;
  UserID: any;
}

function DashboardSideBarMenu() {
  const [userData, setUserData] = useState<UserData>({
    UserName: "",
    UserID: null,
  });

  async function fetchUserData() {
    try {
      // const token = localStorage.getItem("token") as string;
      const user = JSON.parse(localStorage.getItem("ActiveUser") as string);

      if (user.UserID == null) {
        // Set ActiveUser to "Guest" and null for UserID
        // Set ActiveUser to "Guest" and null for UserID
        const guestUser = {
          UserName: "ゲスト",
          UserID: null,
        };

        localStorage.setItem("ActiveUser", JSON.stringify(guestUser));

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
        // Set the guest user data in state
        setUserData(guestUser);
      } else {
        const token = localStorage.getItem("token");
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: window.location.protocol + "//" + window.location.hostname + ":3001/api/checkuser",
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        const response = await axios.request(config);

        // If the request is successful, update the ActiveUser in local storage
        const userData = {
          UserName: response.data.UserName,
          UserID: response.data.UserID,
        };
        localStorage.setItem("ActiveUser", JSON.stringify(userData));

        // Set the user data in state
        setUserData(userData);
      }
    } catch (error) {

        const guestUser = {
          UserName: "ゲスト",
          UserID: null,
        };

        localStorage.setItem("ActiveUser", JSON.stringify(guestUser));

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
        // Set the guest user data in state
        setUserData(guestUser);
    }
  }

  useEffect(() => {
    // Call fetchUserData when the component mounts
    fetchUserData();
  }, []);

  function handleClick(event: any) {
    event.preventDefault();
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("close");
    }
  }
  function handleResize() {
    const sidebar = document.querySelector(".sidebar");
    const screenWidth = window.innerWidth;

    if (sidebar) {
      if (screenWidth <= 600) {
        sidebar.classList.remove("close");
      }
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  const handleLogout = () => {
    localStorage.removeItem("token");
    const guestUser = {
      UserName: "ゲスト",
      UserID: null,
    };

    localStorage.setItem("ActiveUser", JSON.stringify(guestUser));
    // setTimeout(() => {
    window.location.reload();
    // }, 1000);
  };

  function changeOnStatus() {
    const createAccount = (
      <div className="bottom-content">
        <li className="LogStatus">
          <Link to="/login">
            <div className="icon" />
            <div className="UserData">
              <FontAwesomeIcon icon={faUserSecret} />
              ゲスト
            </div>
          </Link>
        </li>
        <li className="LogStatus">
          <Link to="/login">
            <FontAwesomeIcon icon={faRightToBracket} className="icon" />
            <span className="text nav-text">ログイン</span>
          </Link>
        </li>
      </div>
    );

    const logOut = (
      <div className="bottom-content">
        <li className="LogStatus">
          <Link to="/login">
            <div className="icon" />
            <div className="UserData">{userData ? userData.UserName : ""}</div>
          </Link>
        </li>
        <li className="LogStatus">
          <Link to="/" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
            <span className="text nav-text">ログアウト</span>
          </Link>
        </li>
      </div>
    );

    {
      const user = JSON.parse(localStorage.getItem("ActiveUser") as string);

      const action = user.UserID !== null ? logOut : createAccount;

      return action;
    }
  }

  return (
    <main className="whole-page container-fluid">
      <nav className="sidebar noselect someClass">
        <header>
          <div className="image-text">
            <span className="image">
              <img src={logo} alt="logo" />
            </span>
            <div className="text header-text">
              <span className="name noselect">NIKKI</span>
              <span className="profession noselect">いつも時間通り</span>
            </div>
          </div>
          <div className="toggle cursor" onClick={handleClick}>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
          <CurrentDate />
        </header>

        <div className="header2">
          <div className="image-text">
            <span className="image">
              <img src={logo} alt="logo" />
            </span>
            <div className="text header-text">
              <span className="name noselect">NIKKI</span>
              <span className="profession noselect">いつも時間通り</span>
            </div>
          </div>
          <CurrentDate />
        </div>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link">
                <Link to={`/`}>
                  <FontAwesomeIcon icon={faList} className="icon" />
                  <span className="text nav-text">すべてのタスク</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/today">
                  <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                  <span className="text nav-text">今日のタスク</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/schedule">
                  <FontAwesomeIcon icon={faCalendarDays} className="icon" />
                  <span className="text nav-text">スケジュール</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="#">
                  <FontAwesomeIcon icon={faRotateRight} className="icon" />
                  <span className="text nav-text">繰り返されるタスク</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/completed">
                  <FontAwesomeIcon icon={faThumbsUp} className="icon" />
                  <span className="text nav-text">完了したタスク</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/uncompleted">
                  <FontAwesomeIcon icon={faBoxOpen} className="icon" />
                  <span className="text nav-text">未完了のタスク</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/categories">
                  <FontAwesomeIcon
                    icon={faFolderPlus}
                    className="icon"
                    id="addCategoryIcon"
                  />
                  <span className="text nav-text" id="addCategoryText">
                    カテゴリー一覧
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {changeOnStatus()}
        </div>
      </nav>
      <Outlet />
    </main>
  );
}

export default DashboardSideBarMenu;

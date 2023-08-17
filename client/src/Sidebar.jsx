// Import React and the stylesheet
import React from "react";
import "./style.css";

// Import the font awesome icons
import { faList, faCalendarDay, faRotateRight, faThumbsUp, faBoxOpen, faTrashCan, faCircleChevronRight, faRightFromBracket, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Create a component that renders the JSX
function DashboardSideBarMenu(props) {
  // You can add any state or logic here if needed

  return (
    <nav className="sidebar">
      <header>
        <div className="image-text">
          <span className="image">
            {/* Use the src attribute to import the image */}
            <img src="logo.png" alt="logo" />
          </span>
          <div className="text header-text">
            <span className="name">NIKKI</span>
            <span className="profession">Always On Time</span>
          </div>
        </div>

        {/* Use the FontAwesomeIcon component to render the icons */}
        <FontAwesomeIcon icon={faCircleChevronRight} className="toggle cursor" />
      </header>
      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <a href="#">
                <FontAwesomeIcon icon={faList} className="icon" />
                <span className="text nav-text">All Tasks</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <FontAwesomeIcon icon={faCalendarDay} className="icon" />
                <span className="text nav-text">Today's Tasks</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <FontAwesomeIcon icon={faRotateRight} className="icon" />
                <span className="text nav-text">Repeated Tasks</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <FontAwesomeIcon icon={faThumbsUp} className="icon" />
                <span className="text nav-text">Completed Tasks</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <FontAwesomeIcon icon={faBoxOpen} className="icon" />
                <span className="text nav-text">Uncompleted Tasks</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <FontAwesomeIcon icon={faTrashCan} className="icon" />
                <span className="text nav-text">Deleated Tasks</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="bottom-content">
          <li className="">
            <a href="#">
              <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
              <span className="text nav-text">Log Out</span>
            </a>
          </li>

          {/* Use a custom component to render the toggle switch */}
          {/* You can define the logic and style for this component in another file */}
          {/* You can also pass props to this component if needed */}
          {/* For example, you can pass a prop called mode that indicates the current mode (dark or light) */}
          {/* You can also pass a prop called onToggle that is a function that handles the toggle event */}
          {/* For simplicity, I will just use a placeholder component name here */}
          {/* You can replace it with your own component name and import it at the top */}
          {/* You can also remove the comment lines if you want */}
          {/*<ToggleSwitch mode={mode} onToggle={onToggle} />*/}
        </div>
      </div>
    </nav>

    {/* Remove the script tag and import the script file at the top */}
    {/*<script src="script.js"></script>*/}
  );
}

export default DashboardSideBarMenu; // Export the component

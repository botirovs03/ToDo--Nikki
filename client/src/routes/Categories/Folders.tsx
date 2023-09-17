import { useState } from "react";
import st from "./categories.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

import {
  faThumbtack,
  faEdit,
  faTrash,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import qs from "qs";

const Folder = ({ categories, triggerFetch }: any) => {
  const [editModeFolderId, setEditModeFolderId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleEditClick = (category: any) => {
    // Set the currently edited folder
    setEditModeFolderId(category.CategoryID);
    setNewCategoryName(category.CategoryName);
  };

  const handleSaveClick = (category: any) => {
    

    // Check if the user is a guest (you can use your own logic to determine this)
    // Check if the user is a guest (not logged in)
    const isGuest = !localStorage.getItem("token");

    if (isGuest) {
      // Update the category in local storage
      const updatedCategory = {
        ...category,
        CategoryName: newCategoryName,
      };

      // Call the function to update the category in local storage
      updateCategoryInLocalStorage(updatedCategory);

      // Trigger any necessary actions (e.g., re-rendering)
      handleCancelClick();
      triggerFetch();
    } else {
      // Make an Axios request to update the category on the server
      let data = qs.stringify({
        categoryName: newCategoryName,
      });

      const token = localStorage.getItem("token");

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url:
          "http://" +
          window.location.hostname +
          ":3001/api/categories/" +
          category.CategoryID,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + token,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          handleCancelClick();
          triggerFetch();
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCancelClick = () => {
    // Cancel the edit mode
    setEditModeFolderId(null);
  };

  const handleDeleteClick = (category: any) => {
    const token = localStorage.getItem("token");

    // Check if the user is authenticated (not a guest)
    if (token) {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `http://${window.location.hostname}:3001/api/categories/${category.CategoryID}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      Swal.fire({
        title: "本当に削除しますか？",
        text: "フォルダが削除されると、内部のタスクも削除されます。",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "削除します!",
        cancelButtonText: "キャンセル",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              triggerFetch(); // Trigger the fetch function here
            })
            .catch((error) => {
              console.log(error);
            });
          Swal.fire({
            icon: "success",
            title: "削除が成功しました",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      });
    } else {
      Swal.fire({
        title: "本当に削除しますか？",
        text: "フォルダが削除されると、内部のタスクも削除されます。",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "削除します!",
        cancelButtonText: "キャンセル",
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user is a guest, remove the category from localStorage
          removeCategoryFromLocal(category.CategoryID);
          Swal.fire({
            icon: "success",
            title: "削除が成功しました",
            showConfirmButton: false,
            timer: 1000,
          });
          triggerFetch();
        }
      });
    }
  };

  return (
    <>
      {categories.map((category: any) => (
        <div className={st.categoryFolders} key={category.CategoryID}>
          <div className={st.buttons}>
            {editModeFolderId === category.CategoryID ? (
              <>
                <div onClick={() => handleSaveClick(category)}>
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className={st.button + " " + st.update}
                  />
                </div>

                <div onClick={handleCancelClick}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={st.button + " " + st.cancel}
                  />
                </div>
              </>
            ) : (
              <>
                <div onClick={() => handleEditClick(category)}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={st.button + " " + st.update}
                  />
                </div>
                <div onClick={() => handleDeleteClick(category)}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={st.button + " " + st.delete}
                  />
                </div>
              </>
            )}
          </div>
          <FontAwesomeIcon icon={faThumbtack} className={st.icon} />
          <div className={st.categoryName}>
            {editModeFolderId === category.CategoryID ? (
              <input
                className={st.UpdateCategory}
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            ) : (
              category.CategoryName
            )}
          </div>
          <div className={st.categoryCount}>{category.taskCount}</div>
        </div>
      ))}
    </>
  );
};

export default Folder;

// Function to remove a category from localStorage by categoryID
function removeCategoryFromLocal(categoryID: any) {
  let categories = getCategoriesFromLocal();

  // Retrieve tasks from local storage
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  // Filter out the category to be removed
  const updatedCategories = categories.filter(
    (category:any) => category.CategoryID !== categoryID
  );

  // Filter out tasks associated with the category to be removed
  const updatedTasks = tasks.filter(
    (task:any) => task.CategoryID !== categoryID
  );

  // Update local storage with the modified categories and tasks
  localStorage.setItem("categories", JSON.stringify(updatedCategories));
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
// Function to get categories from localStorage
function getCategoriesFromLocal() {
  try {
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    return categories;
  } catch (error) {
    console.error("Error retrieving categories from local storage:", error);
    return [];
  }
}

function updateCategoryInLocalStorage(categoryToUpdate: any) {
  try {
    // Retrieve categories from local storage
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");

    // Find the index of the category to update
    const categoryIndex = categories.findIndex(
      (category: any) => category.CategoryID === categoryToUpdate.CategoryID
    );

    // If the category is found, update it
    if (categoryIndex !== -1) {
      categories[categoryIndex] = categoryToUpdate;

      // Save the updated categories back to local storage
      localStorage.setItem("categories", JSON.stringify(categories));

      // Optionally, you can return the updated categories
      return categories;
    } else {
      // Category not found
      console.error("Category not found in local storage.");
    }
  } catch (error) {
    console.error("Error updating category in local storage:", error);
  }
}

CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
)
;

CREATE TABLE categories (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    categoryName VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES users(userID)
);


CREATE TABLE tasks (
    taskID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    categoryID INT,
    taskName VARCHAR(255),
    description TEXT,
    priority ENUM('High', 'Medium', 'Low'),
    deadline TIMESTAMP,
    completed BOOLEAN,
    completedDate TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (categoryID) REFERENCES categories(categoryID)
);

CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255),
    Email VARCHAR(255),
    Password VARCHAR(255)
);

CREATE TABLE categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    CategoryName VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);


CREATE TABLE tasks (
    TaskID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    CategoryID INT,
    TaskName VARCHAR(255),
    Description TEXT,
    Priority ENUM('High', 'Medium', 'Low'),
    Deadline TIMESTAMP,
    Completed BOOLEAN,
    CompletedDate TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID)
);

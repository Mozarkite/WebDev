drop table if exists Users Cascade;
drop table if exists Db_tasks Cascade;
drop table if exists User_tasks Cascade;
drop table if exists User_to_do_list Cascade;
drop table if exists user_completed_tasks Cascade;
drop table if exists User_favourited_tasks cascade;


-- Users table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,   
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Premade tasks table
CREATE TABLE Db_tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    task_category VARCHAR(50) NOT NULL,
    task_importance INT NOT NULL,
    task_time_limit TIMESTAMPTZ        --optional due date for premade tasks
);

-- Users-created tasks table
CREATE TABLE User_tasks (
    task_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    task_name VARCHAR(100) NOT NULL,
    task_category VARCHAR(50) NOT NULL,
    task_importance INT NOT NULL,
    task_time_limit TIMESTAMPTZ,       --user can set a due date
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- To-do list table: contains tasks that a user plans to do
-- Can link to either User_tasks or Db_tasks
CREATE TABLE User_to_do_list (
    todo_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_task_id INT,                  
    db_task_id INT,                    
    task_name VARCHAR(100) NOT NULL,
    task_category VARCHAR(50) NOT NULL,
    task_importance INT NOT NULL,
    task_time_limit TIMESTAMPTZ,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_task_id) REFERENCES User_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (db_task_id) REFERENCES Db_tasks(task_id) ON DELETE CASCADE,
    CHECK ((user_task_id IS NOT NULL AND db_task_id IS NULL) OR
           (user_task_id IS NULL AND db_task_id IS NOT NULL))
);

-- Completed tasks table
CREATE TABLE User_completed_tasks (
    completed_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    todo_id INT NOT NULL,               --the task from User_to_do_list that was completed
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (todo_id) REFERENCES User_to_do_list(todo_id) ON DELETE CASCADE
);

--Favourited tasks table
CREATE TABLE User_favourited_tasks (
    favourite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_task_id INT,
    db_task_id INT,
    favourited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_task_id) REFERENCES User_tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (db_task_id) REFERENCES Db_tasks(task_id) ON DELETE CASCADE,

    --Ensure exactly one type of task is favourited
    CHECK (
        (user_task_id IS NOT NULL AND db_task_id IS NULL) OR
        (user_task_id IS NULL AND db_task_id IS NOT NULL)
    ),

    --Prevent duplicate favourites
    UNIQUE (user_id, user_task_id),
    UNIQUE (user_id, db_task_id)
);

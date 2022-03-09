DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db; 

CREATE TABLE department (
    
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    

    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL NOT NULL,
    department_id INT NULL
    -- INDEX dep_ind (department_id)
    -- CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL

);

CREATE TABLE employee (

id INT NOT NULL AUTO_INCREMENT,

first_name VARCHAR(30) NOT NULL,

last_name VARCHAR(30) NOT NULL,

role_id INT NOT NULL,

manager_id INT NULL,

PRIMARY KEY (id)

);


SHOW TABLES;

CREATE TABLE user(
    id varchar(50) Primary Key,
    username varchar(50) Unique,
    email varchar(50) Unique Not Null,
    password varchar(30) Not Null
);
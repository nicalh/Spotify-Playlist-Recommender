
USE SpotifySite;

CREATE TABLE Users (
	uid varchar(255) NOT NULL PRIMARY KEY,
	username varchar(50),
	email varchar(100),
	country varchar(60)
);

CREATE TABLE Song (
	sid varchar(255) NOT NULL PRIMARY KEY,
	title varchar(50),
	artist varchar(50),
	album varchar(50),
	uri varchar(255)
);

CREATE TABLE Artist (
	artid varchar(255) NOT NULL PRIMARY KEY,
	name varchar(50),
	genre varchar(50)
);

CREATE TABLE Album (
	alid varchar(255) NOT NULL PRIMARY KEY,
	name varchar(50),
	artist varchar(50),
	genre varchar(50)
);

CREATE TABLE Playlist (
	pid varchar(255) NOT NULL PRIMARY KEY,
	uid varchar(255),
	date varchar(20),
	name varchar(255)
);

CREATE TABLE Playlist_Songs (
	pid varchar(255),
	sid varchar(255)
);

CREATE TABLE Events (
	eid varchar(255) NOT NULL PRIMARY KEY,
	orgid varchar(255),
	name varchar(50),
	location varchar(50),
	date varchar(50)
);

CREATE TABLE Event_Playlist (
	eid varchar(255),
	pid varchar(255)
);

CREATE TABLE Event_Registered (
	eid varchar(255),
	uid varchar(255)
);

CREATE TABLE User_Preference_Genre (
	uid varchar(255),
	genid varchar(255)
);

CREATE TABLE User_Artist (
	uid varchar(255),
	artid varchar(255)
);

CREATE TABLE User_Song (
	uid varchar(255),
	sid varchar(255),
	uri varchar(255)
);


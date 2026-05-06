CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  fees_range INTEGER NOT NULL CHECK (fees_range > 0),
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  placement_percentage INTEGER NULL CHECK (placement_percentage >= 0 AND placement_percentage <= 100),
  avg_package INTEGER NULL CHECK (avg_package >= 0),
  ranking INTEGER NULL CHECK (ranking > 0)
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  degree_type VARCHAR(80) NOT NULL,
  duration_years INTEGER NOT NULL CHECK (duration_years > 0)
);

CREATE TABLE IF NOT EXISTS college_courses (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  annual_fees INTEGER NOT NULL CHECK (annual_fees > 0),
  UNIQUE (college_id, course_id)
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS saved_colleges (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  UNIQUE (user_id, college_id)
);

CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);
CREATE INDEX IF NOT EXISTS idx_college_courses_college_id ON college_courses(college_id);
CREATE INDEX IF NOT EXISTS idx_college_courses_course_id ON college_courses(course_id);

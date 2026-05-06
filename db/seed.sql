TRUNCATE TABLE college_courses RESTART IDENTITY CASCADE;
TRUNCATE TABLE courses RESTART IDENTITY CASCADE;
TRUNCATE TABLE saved_colleges RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE colleges RESTART IDENTITY CASCADE;

INSERT INTO colleges (name, city, state, fees_range, rating, placement_percentage, avg_package, ranking) VALUES
('Indian Institute of Information Technology Bangalore', 'Bengaluru', 'Karnataka', 360000, 4.8, 96, 1540000, 9),
('RV College of Engineering', 'Bengaluru', 'Karnataka', 280000, 4.6, 94, 1250000, 21),
('PES University', 'Bengaluru', 'Karnataka', 450000, 4.5, 92, 1180000, 34),
('BMS College of Engineering', 'Bengaluru', 'Karnataka', 240000, 4.3, 88, 920000, 47),
('Manipal Institute of Technology', 'Manipal', 'Karnataka', 390000, 4.4, 91, 1110000, 28),
('Vellore Institute of Technology', 'Vellore', 'Tamil Nadu', 320000, 4.4, 90, 1020000, 29),
('SSN College of Engineering', 'Chennai', 'Tamil Nadu', 210000, 4.5, 89, 870000, 38),
('Sri Sivasubramaniya Nadar Engineering College', 'Chennai', 'Tamil Nadu', 225000, 4.4, 90, 910000, 41),
('PSG College of Technology', 'Coimbatore', 'Tamil Nadu', 145000, 4.5, 93, 980000, 31),
('Amrita Vishwa Vidyapeetham', 'Coimbatore', 'Tamil Nadu', 300000, 4.3, 86, 840000, 44),
('College of Engineering Guindy', 'Chennai', 'Tamil Nadu', 80000, 4.7, 92, 1060000, 17),
('SRM Institute of Science and Technology', 'Chennai', 'Tamil Nadu', 350000, 4.2, 84, 760000, 53),
('BITS Pilani Hyderabad Campus', 'Hyderabad', 'Telangana', 550000, 4.7, 95, 1770000, 13),
('International Institute of Information Technology Hyderabad', 'Hyderabad', 'Telangana', 420000, 4.9, 98, 2050000, 6),
('Chaitanya Bharathi Institute of Technology', 'Hyderabad', 'Telangana', 160000, 4.2, 82, 690000, 57),
('Vasavi College of Engineering', 'Hyderabad', 'Telangana', 155000, 4.1, 80, 650000, 61),
('Delhi Technological University', 'Delhi', 'Delhi', 190000, 4.8, 95, 1490000, 11),
('Netaji Subhas University of Technology', 'Delhi', 'Delhi', 175000, 4.5, 91, 1230000, 24),
('University School of Information and Communication Technology', 'Delhi', 'Delhi', 130000, 4.3, 87, 850000, 42),
('Institute of Chemical Technology', 'Mumbai', 'Maharashtra', 86000, 4.6, 89, 970000, 33),
('Dwarkadas J. Sanghvi College of Engineering', 'Mumbai', 'Maharashtra', 205000, 4.3, 85, 780000, 50),
('Veermata Jijabai Technological Institute', 'Mumbai', 'Maharashtra', 90000, 4.7, 93, 1090000, 19),
('College of Engineering Pune', 'Pune', 'Maharashtra', 110000, 4.5, 90, 960000, 27),
('Pune Institute of Computer Technology', 'Pune', 'Maharashtra', 165000, 4.4, 92, 1010000, 30),
('MIT World Peace University', 'Pune', 'Maharashtra', 330000, 4.0, 78, 620000, 66),
('Symbiosis Institute of Technology', 'Pune', 'Maharashtra', 345000, 4.1, NULL, NULL, 64);

INSERT INTO courses (name, degree_type, duration_years) VALUES
('Computer Science Engineering', 'B.Tech', 4),
('Information Technology', 'B.Tech', 4),
('Electronics and Communication Engineering', 'B.Tech', 4),
('Mechanical Engineering', 'B.Tech', 4),
('Business Administration', 'BBA', 3),
('Data Science', 'B.Tech', 4);

INSERT INTO college_courses (college_id, course_id, annual_fees)
SELECT c.id, cr.id,
  CASE cr.name
    WHEN 'Computer Science Engineering' THEN LEAST(c.fees_range, c.fees_range - 10000 + 15000)
    WHEN 'Information Technology' THEN LEAST(c.fees_range, c.fees_range - 15000 + 12000)
    WHEN 'Electronics and Communication Engineering' THEN LEAST(c.fees_range, c.fees_range - 20000 + 10000)
    WHEN 'Mechanical Engineering' THEN GREATEST(60000, c.fees_range - 35000)
    WHEN 'Business Administration' THEN GREATEST(70000, c.fees_range - 40000)
    WHEN 'Data Science' THEN LEAST(c.fees_range + 15000, c.fees_range + 25000)
  END
FROM colleges c
JOIN courses cr
  ON cr.name IN (
    'Computer Science Engineering',
    'Information Technology',
    'Electronics and Communication Engineering'
  );

INSERT INTO college_courses (college_id, course_id, annual_fees)
SELECT c.id, cr.id, GREATEST(65000, c.fees_range - 25000)
FROM colleges c
JOIN courses cr ON cr.name = 'Mechanical Engineering'
WHERE c.city IN ('Chennai', 'Coimbatore', 'Pune', 'Mumbai', 'Delhi');

INSERT INTO college_courses (college_id, course_id, annual_fees)
SELECT c.id, cr.id, GREATEST(85000, c.fees_range - 15000)
FROM colleges c
JOIN courses cr ON cr.name = 'Business Administration'
WHERE c.city IN ('Pune', 'Mumbai', 'Bengaluru', 'Hyderabad');

INSERT INTO college_courses (college_id, course_id, annual_fees)
SELECT c.id, cr.id, LEAST(c.fees_range + 20000, c.fees_range + 30000)
FROM colleges c
JOIN courses cr ON cr.name = 'Data Science'
WHERE c.rating >= 4.4;

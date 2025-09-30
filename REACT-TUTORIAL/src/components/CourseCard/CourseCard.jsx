// CourseCard.jsx
import React from 'react';
import './CourseCard.css';

const CourseCard = ({ title, description }) => {
  return (
    <div className="course-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default CourseCard;

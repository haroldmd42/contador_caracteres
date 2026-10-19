import { genAiLlmCourse } from './genai-llm-qa';

/**
 * Central registry of all QA courses available in QATOOLS Academia.
 * Stored locally in code with clean modular structure.
 */
export const COURSES = [
  genAiLlmCourse,
  // Future courses can be added here easily:
  // e.g. istqbFoundationCourse, cypressPlaywrightCourse, apiTestingCourse
];

/**
 * Retrieve a course by its unique slug ID
 * @param {string} courseId
 * @returns {object|undefined}
 */
export function getCourseById(courseId) {
  return COURSES.find((course) => course.id === courseId);
}

/**
 * Get all available courses
 * @returns {Array}
 */
export function getAllCourses() {
  return COURSES;
}

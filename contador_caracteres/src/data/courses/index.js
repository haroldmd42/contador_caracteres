import { fundamentosTestingCourse } from './fundamentos-testing-qa';
import { genAiLlmCourse } from './genai-llm-qa';
import { playwrightAutomationCourse } from './playwright-automation';

/**
 * Central registry of all QA courses available in QATOOLS Academia.
 * Stored locally in code with clean modular structure.
 */
export const COURSES = [
  fundamentosTestingCourse,
  playwrightAutomationCourse,
  genAiLlmCourse,
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

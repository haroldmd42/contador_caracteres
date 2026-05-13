/**
 * Predefined Lorem Ipsum text samples for the character counter tool.
 * Each entry has a label (displayed character count) and the actual text content.
 */

const BASE_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';

export const LOREM_SAMPLES = [
  { label: '100', text: BASE_LOREM },
  {
    label: '200',
    text: `${BASE_LOREM} ${BASE_LOREM.slice(0, 97)}t`,
  },
  {
    label: '300',
    text: `${BASE_LOREM}${BASE_LOREM}${BASE_LOREM}`,
  },
  {
    label: '400',
    text: `${BASE_LOREM}${BASE_LOREM}${BASE_LOREM}${BASE_LOREM}`,
  },
  {
    label: '500',
    text: `${BASE_LOREM}${BASE_LOREM}${BASE_LOREM}${BASE_LOREM}${BASE_LOREM}`,
  },
];

/** Default suggested character limit for the progress bar */
export const DEFAULT_MAX_CHARACTERS = 500;

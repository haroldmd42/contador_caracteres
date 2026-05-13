import './Toast.css';

/**
 * Reusable toast notification component.
 * Shows a floating message at the bottom-right of the viewport.
 *
 * @param {{ message: string, visible: boolean }} props
 */
export default function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="toast-notification" role="alert" aria-live="polite">
      <i className="bi bi-check-circle-fill"></i>
      <span>{message}</span>
    </div>
  );
}

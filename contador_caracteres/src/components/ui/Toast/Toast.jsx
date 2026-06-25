import './Toast.css';

export default function Toast({
  message,
  visible,
  type = 'success'
}) {
  if (!visible) return null;

  return (
    <div
      className={`toast-notification toast-${type}`}
      role="alert"
      aria-live="polite"
    >
      <i className="bi bi-check-circle-fill"></i>
      <span>{message}</span>
    </div>
  );
}
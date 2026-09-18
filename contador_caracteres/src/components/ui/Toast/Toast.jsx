import './Toast.css';

export default function Toast({
  message,
  visible,
  type = 'success'
}) {
  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-circle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      case 'success':
      default:
        return 'bi-check-circle-fill';
    }
  };

  return (
    <div
      className={`toast-notification toast-${type}`}
      role="alert"
      aria-live="polite"
    >
      <i className={`bi ${getIcon()}`}></i>
      <span>{message}</span>
    </div>
  );
}
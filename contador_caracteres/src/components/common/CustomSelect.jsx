import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CustomSelect.css';

/**
 * CustomSelect - Modern, theme-aware universal dropdown component for QATOOLS.
 * Replaces native unstyled browser <select> menus with a sleek, polished floating list.
 * 
 * Props:
 * - value: currently selected value
 * - onChange: callback(newValue) or callback(event)
 * - options: array of { value, label, badge, subtitle, icon, disabled } or strings
 * - placeholder: string shown when no value is selected
 * - size: 'sm' | 'md' | 'lg' (defaults to 'md')
 * - className: additional CSS class names
 * - disabled: boolean
 * - id: string
 * - name: string
 * - icon: string (e.g. 'bi-calendar-event')
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  size = 'md',
  className = '',
  disabled = false,
  id,
  name,
  icon,
  style = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to uniform { value, label, badge, subtitle, icon, disabled }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return {
      value: opt.value !== undefined ? opt.value : opt.id,
      label: opt.label || opt.name || String(opt.value || ''),
      badge: opt.badge || null,
      subtitle: opt.subtitle || null,
      icon: opt.icon || null,
      disabled: Boolean(opt.disabled),
    };
  });

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.custom-select-option');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, focusedIndex]);

  const handleSelect = useCallback(
    (option) => {
      if (option.disabled || disabled) return;
      if (onChange) {
        // Supports both functional callbacks and synthetic event shapes
        const syntheticEvent = {
          target: { value: option.value, name: name || id },
        };
        onChange(option.value, syntheticEvent);
      }
      setIsOpen(false);
    },
    [onChange, disabled, name, id]
  );

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const idx = normalizedOptions.findIndex((opt) => String(opt.value) === String(value));
        setFocusedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < normalizedOptions.length) {
        handleSelect(normalizedOptions[focusedIndex]);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${size ? `custom-select-${size}` : ''} ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      style={style}
      id={id}
    >
      {/* Trigger Button */}
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <div className="custom-select-label-wrapper">
          {icon && <i className={`custom-select-leading-icon ${icon} me-2`}></i>}
          {selectedOption?.icon && <i className={`${selectedOption.icon} me-1.5`}></i>}
          <span className="custom-select-label-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="custom-select-pill-badge ms-2">{selectedOption.badge}</span>
          )}
        </div>
        <span className="custom-select-arrow" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 7.5 10 12.5 15 7.5" />
          </svg>
        </span>
      </button>

      {/* Floating Options Dropdown Menu */}
      {isOpen && (
        <div className="custom-select-dropdown shadow-lg" role="listbox" ref={listRef}>
          {normalizedOptions.length === 0 ? (
            <div className="custom-select-empty text-muted small p-3 text-center">
              No hay opciones disponibles
            </div>
          ) : (
            normalizedOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isFocused = idx === focusedIndex;

              return (
                <div
                  key={opt.value ?? idx}
                  className={`custom-select-option ${isSelected ? 'is-selected' : ''} ${isFocused ? 'is-focused' : ''} ${opt.disabled ? 'is-disabled' : ''}`}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="option-content-left">
                    <div className="option-title-line">
                      {opt.icon && <i className={`${opt.icon} me-1.5 option-icon`}></i>}
                      <span className="option-label">{opt.label}</span>
                      {opt.badge && (
                        <span className="badge bg-warning text-dark option-badge ms-2">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.subtitle && (
                      <span className="option-subtitle small text-muted d-block mt-0.5">
                        {opt.subtitle}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span className="option-check-icon">
                      <i className="bi bi-check2"></i>
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}


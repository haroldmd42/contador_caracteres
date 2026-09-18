import { useState, useRef, useEffect, useMemo } from 'react';
import { getProxyFrameUrl } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import './DeviceSimulator.css';

/**
 * Standard Responsive Breakpoint Definitions based on QA Specs:
 * - Mobile: 0 - 767 px
 * - Tablet: 768 - 1023 px
 * - Desktop: 1024 px en adelante
 * - Desktop grande: 1280 / 1440 px en adelante
 */
export const RESPONSIVE_BREAKPOINTS = [
  {
    id: 'mobile',
    title: 'Mobile',
    range: '0 - 767 px',
    icon: 'bi-phone',
    badgeClass: 'badge-range-mobile',
    pills: [
      { label: '375 px', width: 375, height: 667, name: 'Mobile Mini (375 × 667)', frameType: 'iphone-classic' },
      { label: '390 px', width: 390, height: 844, name: 'iPhone Estándar (390 × 844)', frameType: 'iphone' },
      { label: '412 px', width: 412, height: 915, name: 'Android XL (412 × 915)', frameType: 'android' },
      { label: '767 px', width: 767, height: 820, name: 'Límite Mobile (767 × 820)', frameType: 'android' },
    ],
  },
  {
    id: 'tablet',
    title: 'Tablet',
    range: '768 - 1023 px',
    icon: 'bi-tablet',
    badgeClass: 'badge-range-tablet',
    pills: [
      { label: '768 px', width: 768, height: 1024, name: 'Tablet 768 px (iPad)', frameType: 'tablet' },
      { label: '820 px', width: 820, height: 1180, name: 'iPad Air (820 × 1180)', frameType: 'tablet' },
      { label: '912 px', width: 912, height: 1368, name: 'Surface Pro (912 × 1368)', frameType: 'tablet' },
      { label: '1023 px', width: 1023, height: 768, name: 'Límite Tablet (1023 × 768)', frameType: 'tablet' },
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop',
    range: '1024 px en adelante',
    icon: 'bi-laptop',
    badgeClass: 'badge-range-desktop',
    pills: [
      { label: '1024 px', width: 1024, height: 768, name: 'Desktop Base (1024 × 768)', frameType: 'laptop' },
      { label: '1280 px', width: 1280, height: 800, name: 'Laptop 13" (1280 × 800)', frameType: 'laptop' },
      { label: '1366 px', width: 1366, height: 768, name: 'Laptop HD (1366 × 768)', frameType: 'laptop' },
    ],
  },
  {
    id: 'desktop-large',
    title: 'Desktop grande',
    range: '1280 / 1440 px en adelante',
    icon: 'bi-display',
    badgeClass: 'badge-range-large',
    pills: [
      { label: '1440 px', width: 1440, height: 900, name: 'Monitor 24" (1440 × 900)', frameType: 'monitor' },
      { label: '1920 px', width: 1920, height: 1080, name: 'Full HD 1080p (1920 × 1080)', frameType: 'monitor' },
      { label: '2560 px', width: 2560, height: 1440, name: 'Monitor 2K QHD (2560 × 1440)', frameType: 'monitor' },
    ],
  },
];

/**
 * Catalog of standard devices
 */
export const DEVICE_CATALOG = [
  // --- MÓVILES ---
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    category: 'mobile',
    width: 393,
    height: 852,
    dpr: 3,
    frameType: 'iphone',
    hasIsland: true,
    icon: 'bi-phone',
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14 / 13',
    category: 'mobile',
    width: 390,
    height: 844,
    dpr: 3,
    frameType: 'iphone',
    hasNotch: true,
    icon: 'bi-phone',
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE (Gen 3)',
    category: 'mobile',
    width: 375,
    height: 667,
    dpr: 2,
    frameType: 'iphone-classic',
    icon: 'bi-phone',
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 3.5,
    frameType: 'android',
    hasPunchHole: true,
    icon: 'bi-phone',
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8',
    category: 'mobile',
    width: 412,
    height: 924,
    dpr: 2.6,
    frameType: 'android',
    hasPunchHole: true,
    icon: 'bi-phone',
  },
  {
    id: 'mobile-limit',
    name: 'Límite Mobile (767 px)',
    category: 'mobile',
    width: 767,
    height: 820,
    dpr: 2,
    frameType: 'android',
    icon: 'bi-phone',
  },

  // --- TABLETS ---
  {
    id: 'ipad-mini',
    name: 'Tablet 768 px (iPad Mini)',
    category: 'tablet',
    width: 768,
    height: 1024,
    dpr: 2,
    frameType: 'tablet',
    icon: 'bi-tablet',
  },
  {
    id: 'ipad-air',
    name: 'iPad Air 10.9"',
    category: 'tablet',
    width: 820,
    height: 1180,
    dpr: 2,
    frameType: 'tablet',
    icon: 'bi-tablet',
  },
  {
    id: 'surface-pro-9',
    name: 'Surface Pro 9',
    category: 'tablet',
    width: 912,
    height: 1368,
    dpr: 2,
    frameType: 'tablet',
    icon: 'bi-tablet',
  },
  {
    id: 'tablet-limit',
    name: 'Límite Tablet (1023 px)',
    category: 'tablet',
    width: 1023,
    height: 768,
    dpr: 2,
    frameType: 'tablet',
    icon: 'bi-tablet',
  },

  // --- COMPUTADORES / DESKTOP ---
  {
    id: 'desktop-base',
    name: 'Desktop Base (1024 × 768)',
    category: 'desktop',
    width: 1024,
    height: 768,
    dpr: 1,
    frameType: 'laptop',
    icon: 'bi-laptop',
  },
  {
    id: 'laptop-1280',
    name: 'MacBook / Laptop 13" (1280 × 800)',
    category: 'desktop',
    width: 1280,
    height: 800,
    dpr: 2,
    frameType: 'laptop',
    icon: 'bi-laptop',
  },
  {
    id: 'laptop-hd',
    name: 'Laptop Estándar HD (1366 × 768)',
    category: 'desktop',
    width: 1366,
    height: 768,
    dpr: 1,
    frameType: 'laptop',
    icon: 'bi-laptop',
  },
  {
    id: 'desktop-1440',
    name: 'Desktop Monitor 24" (1440 × 900)',
    category: 'desktop',
    width: 1440,
    height: 900,
    dpr: 1,
    frameType: 'monitor',
    icon: 'bi-display',
  },
  {
    id: 'desktop-fhd',
    name: 'Desktop Full HD 1080p (1920 × 1080)',
    category: 'desktop',
    width: 1920,
    height: 1080,
    dpr: 1,
    frameType: 'monitor',
    icon: 'bi-display',
  },
  {
    id: 'desktop-2k',
    name: 'Monitor 2K QHD (2560 × 1440)',
    category: 'desktop',
    width: 2560,
    height: 1440,
    dpr: 1,
    frameType: 'monitor',
    icon: 'bi-display',
  },
];

const PRESET_URLS = [
  { label: 'Wikipedia', url: 'https://es.wikipedia.org' },
  { label: 'W3Schools', url: 'https://www.w3schools.com' },
  { label: 'Local:5173', url: 'http://localhost:5173' },
  { label: 'Local:3000', url: 'http://localhost:3000' },
];

export default function DeviceSimulator() {
  // Navigation & URL states
  const [inputUrl, setInputUrl] = useState('https://es.wikipedia.org');
  const [activeUrl, setActiveUrl] = useState('https://es.wikipedia.org');
  const [refreshKey, setRefreshKey] = useState(0);

  // Theme states (simulated view + app theme sync)
  const { theme: appTheme, toggleTheme: toggleAppTheme } = useTheme();
  const [simulatedTheme, setSimulatedTheme] = useState(appTheme || 'light');

  // Sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Device & Viewport states
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_CATALOG[0]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isRotated, setIsRotated] = useState(false); // Flips width and height
  const [showBezel, setShowBezel] = useState(true);
  const [useProxy, setUseProxy] = useState(true);
  const [isMultiView, setIsMultiView] = useState(false);
  const [customWidth, setCustomWidth] = useState(393);
  const [customHeight, setCustomHeight] = useState(852);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [scrollbarMode, setScrollbarMode] = useState('hidden'); // 'hidden' | 'thin' | 'default'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Scaling / Zoom states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const canvasContainerRef = useRef(null);
  const [isLoadingIframe, setIsLoadingIframe] = useState(false);
  const [showSecurityTip, setShowSecurityTip] = useState(false);
  const [enableSandbox, setEnableSandbox] = useState(false);

  // Safety timer to prevent stuck loading overlay from blocking clicks
  useEffect(() => {
    if (isLoadingIframe) {
      const timer = setTimeout(() => {
        setIsLoadingIframe(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingIframe]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute active dimensions (fixed: does NOT force landscape/portrait by min/max)
  const activeWidth = useMemo(() => {
    let w = isCustomMode ? customWidth : selectedDevice.width;
    let h = isCustomMode ? customHeight : selectedDevice.height;
    return isRotated ? h : w;
  }, [isCustomMode, customWidth, customHeight, selectedDevice, isRotated]);

  const activeHeight = useMemo(() => {
    let w = isCustomMode ? customWidth : selectedDevice.width;
    let h = isCustomMode ? customHeight : selectedDevice.height;
    return isRotated ? w : h;
  }, [isCustomMode, customWidth, customHeight, selectedDevice, isRotated]);

  // Determine which range according to the requested table:
  // Mobile (0 - 767), Tablet (768 - 1023), Desktop (1024+), Desktop grande (1280 / 1440+)
  const activeBreakpointRange = useMemo(() => {
    if (activeWidth <= 767) {
      return {
        id: 'mobile',
        name: 'Mobile',
        range: '0 - 767 px',
        badgeClass: 'badge-range-mobile',
        icon: 'bi-phone',
      };
    } else if (activeWidth <= 1023) {
      return {
        id: 'tablet',
        name: 'Tablet',
        range: '768 - 1023 px',
        badgeClass: 'badge-range-tablet',
        icon: 'bi-tablet',
      };
    } else if (activeWidth < 1440) {
      return {
        id: 'desktop',
        name: 'Desktop',
        range: '1024 px en adelante',
        badgeClass: 'badge-range-desktop',
        icon: 'bi-laptop',
      };
    } else {
      return {
        id: 'desktop-large',
        name: 'Desktop grande',
        range: '1280 / 1440 px en adelante',
        badgeClass: 'badge-range-large',
        icon: 'bi-display',
      };
    }
  }, [activeWidth]);

  // Compute final effective URL based on direct vs proxy mode
  const effectiveUrl = useMemo(() => {
    if (!activeUrl) return '';
    return useProxy ? getProxyFrameUrl(activeUrl, simulatedTheme, scrollbarMode) : activeUrl;
  }, [activeUrl, useProxy, simulatedTheme, scrollbarMode]);

  // Auto-fit computation (re-runs when sidebar opens/closes, zoom changes, or dimensions change)
  useEffect(() => {
    if (!isAutoFit || isMultiView) return;

    function calculateFit() {
      if (!canvasContainerRef.current) return;
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const paddingX = showBezel ? 80 : 40;
      const paddingY = showBezel ? 90 : 40;

      const availWidth = Math.max(200, rect.width - paddingX);
      const availHeight = Math.max(200, rect.height - paddingY);

      const scaleX = availWidth / activeWidth;
      const scaleY = availHeight / activeHeight;
      const targetScale = Math.min(1, scaleX, scaleY);

      setZoomLevel(Math.round(targetScale * 100) / 100);
    }

    calculateFit();
    const timer = setTimeout(calculateFit, 280);
    window.addEventListener('resize', calculateFit);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateFit);
    };
  }, [activeWidth, activeHeight, isAutoFit, showBezel, isMultiView, isSidebarOpen]);

  // Handle URL Submission
  const handleLoadUrl = (e) => {
    if (e) e.preventDefault();
    let url = inputUrl.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
      setInputUrl(url);
    }
    setActiveUrl(url);
    setIsLoadingIframe(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCategoryChange = (catId) => {
    setCategoryFilter(catId);
    if (catId !== 'all') {
      const firstInCat = DEVICE_CATALOG.find((d) => d.category === catId);
      if (firstInCat) {
        setSelectedDevice(firstInCat);
        setIsCustomMode(false);
        setIsRotated(false);
      }
    }
  };

  const handleSelectBreakpointPill = (pill) => {
    setIsCustomMode(true);
    setCustomWidth(pill.width);
    setCustomHeight(pill.height);
    setIsRotated(false);
  };

  const handleDeviceChange = (device) => {
    setIsCustomMode(false);
    setSelectedDevice(device);
    setIsRotated(false);
  };

  const handleSelectCustom = () => {
    setIsCustomMode(true);
  };

  const handleRotate = () => {
    setIsRotated((prev) => !prev);
  };

  const handleRefresh = () => {
    setIsLoadingIframe(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenNewWindow = () => {
    window.open(
      activeUrl,
      '_blank',
      `width=${activeWidth},height=${activeHeight},menubar=no,status=no,toolbar=no`
    );
  };

  // Filtered devices list for dropdown
  const displayedDevices = useMemo(() => {
    if (categoryFilter === 'all') return DEVICE_CATALOG;
    return DEVICE_CATALOG.filter((d) => d.category === categoryFilter);
  }, [categoryFilter]);

  // Devices for Multi-View mode
  const multiViewDevices = useMemo(() => {
    return [
      { ...DEVICE_CATALOG.find((d) => d.id === 'iphone-15-pro'), label: 'Mobile' },
      { ...DEVICE_CATALOG.find((d) => d.id === 'ipad-air'), label: 'Tablet' },
      { ...DEVICE_CATALOG.find((d) => d.id === 'laptop-hd'), label: 'Desktop (Computador)' },
    ];
  }, []);

  return (
    <div className="device-simulator-app container-fluid py-3 px-3 px-lg-4">
      {/* Top compact header */}
      <div className="simulator-header-compact d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="header-icon-pill">
            <i className="bi bi-phone-landscape"></i>
          </div>
          <div>
            <h1 className="h5 fw-bold mb-0 text-body">Simulador Responsive Multi-Pantalla</h1>
            <span className="small text-muted">Simula cualquier URL en pantallas reales de computadores, tablets y móviles.</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Toggle sidebar button if collapsed */}
          {!isSidebarOpen && (
            <button
              className="btn btn-sm btn-primary d-flex align-items-center gap-2"
              onClick={() => setIsSidebarOpen(true)}
              title="Mostrar panel de opciones"
            >
              <i className="bi bi-layout-sidebar-inset"></i>
              <span>Opciones</span>
            </button>
          )}

          {/* Toggle Multi-Device Mode */}
          <button
            className={`btn btn-sm ${isMultiView ? 'btn-info' : 'btn-outline-secondary'} d-flex align-items-center gap-1`}
            onClick={() => setIsMultiView(!isMultiView)}
            title="Alternar entre vista de dispositivo individual y vista paralela"
          >
            <i className={`bi ${isMultiView ? 'bi-grid-fill' : 'bi-columns-gap'}`}></i>
            <span className="d-none d-md-inline">{isMultiView ? 'Vista Individual' : 'Vista Paralela (3 Dispositivos)'}</span>
          </button>

          {/* Help button */}
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => setShowSecurityTip(!showSecurityTip)}
            title="Información sobre restricciones de seguridad iframe (X-Frame-Options)"
          >
            <i className="bi bi-question-circle"></i>
          </button>
        </div>
      </div>

      {/* Security Tip Banner */}
      {showSecurityTip && (
        <div className="alert alert-info alert-dismissible fade show mb-3 shadow-sm border-0" role="alert">
          <div className="d-flex gap-3">
            <i className="bi bi-shield-lock-fill fs-4 text-info"></i>
            <div className="small">
              <strong>¿El sitio no carga en el frame o aparece pantalla gris?</strong>
              <p className="mb-1">
                Sitios web con <code>X-Frame-Options: SAMEORIGIN/DENY</code> o <code>CSP</code> bloquean iframes por seguridad.
              </p>
              <div className="d-flex flex-wrap gap-2 align-items-center mt-1">
                <span className="badge bg-primary">Solución 1:</span>
                <span>Activa <strong>"Proxy QA"</strong> en el panel izquierdo para remover esos bloqueos mediante el backend.</span>
                <span className="badge bg-secondary ms-2">Solución 2:</span>
                <span>Usa <strong>"Abrir Ventana"</strong> para probar con la resolución exacta en una ventana nativa.</span>
              </div>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={() => setShowSecurityTip(false)}></button>
        </div>
      )}

      {/* Main Split Layout: Left Controls Sidebar + Right Simulator Canvas */}
      <div className={`simulator-split-layout ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        {/* =========================================================
            LEFT SIDEBAR: CONTROLS & URL CONFIGURATION
            ========================================================= */}
        {isSidebarOpen && (
          <aside className="simulator-sidebar shadow-sm">
            {/* Sidebar Header */}
            <div className="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
              <span className="fw-bold d-flex align-items-center gap-2 small text-uppercase letter-spacing">
                <i className="bi bi-sliders text-primary"></i> Configuración
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary btn-icon-round"
                onClick={() => setIsSidebarOpen(false)}
                title="Ocultar panel para maximizar la pantalla"
                aria-label="Ocultar opciones"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            </div>

            {/* Sidebar Content Scrollable */}
            <div className="sidebar-content p-3">
              {/* 1. SECCIÓN: ENLACE / URL */}
              <div className="sidebar-group mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase mb-2">
                  <i className="bi bi-link-45deg me-1 text-primary"></i> Enlace Web (URL)
                </label>
                <form onSubmit={handleLoadUrl}>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="https://ejemplo.com"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                    {inputUrl && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setInputUrl('')}
                        title="Limpiar"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                    <button type="submit" className="btn btn-sm btn-primary px-3">
                      Ir
                    </button>
                  </div>
                </form>

                {/* Quick Presets */}
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {PRESET_URLS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      className="btn btn-xs preset-url-btn"
                      onClick={() => {
                        setInputUrl(preset.url);
                        setActiveUrl(preset.url);
                        setIsLoadingIframe(true);
                        setRefreshKey((prev) => prev + 1);
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Actions: Refresh, Pop-out, Proxy */}
                <div className="d-flex align-items-center justify-content-between p-2 rounded bg-surface-subtle border">
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleRefresh}
                      title="Recargar frame"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleOpenNewWindow}
                      title="Abrir en ventana flotante con tamaño exacto"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </button>
                  </div>

                  {/* Proxy QA Toggle */}
                  <div className="form-check form-switch mb-0" title="Activa el backend para remover bloqueos X-Frame-Options">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sidebarProxyToggle"
                      checked={useProxy}
                      onChange={(e) => {
                        setUseProxy(e.target.checked);
                        setIsLoadingIframe(true);
                        setRefreshKey((prev) => prev + 1);
                      }}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="sidebarProxyToggle">
                      Proxy QA
                    </label>
                  </div>
                </div>

                {/* Sandbox Permissions Toggle */}
                <div className="d-flex align-items-center justify-content-between p-2 mt-2 rounded bg-surface-subtle border" title="Desactivado por defecto para permitir que todos los menús hamburguesa, botones y scripts funcionen sin restricciones">
                  <div className="d-flex flex-column">
                    <span className="small fw-bold">Modo Sandbox</span>
                    <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                      {enableSandbox ? '🔒 Estricto (Restricciones activas)' : '⚡ Permisivo (Menús y clics al 100%)'}
                    </span>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sidebarSandboxToggle"
                      checked={enableSandbox}
                      onChange={(e) => {
                        setEnableSandbox(e.target.checked);
                        setIsLoadingIframe(true);
                        setRefreshKey((prev) => prev + 1);
                      }}
                    />
                  </div>
                </div>

                {/* Notice for X-Frame-Options */}
                {!useProxy && (
                  <div className="alert alert-warning py-2 px-2 small mt-2 mb-0 rounded border-0 shadow-sm">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="fw-bold d-flex align-items-center gap-1 text-warning-emphasis" style={{ fontSize: '0.78rem' }}>
                        <i className="bi bi-shield-exclamation"></i> ¿Rechazó la conexión?
                      </span>
                      <button
                        type="button"
                        className="btn btn-xs btn-warning fw-semibold px-2"
                        onClick={() => {
                          setUseProxy(true);
                          setIsLoadingIframe(true);
                          setRefreshKey((prev) => prev + 1);
                        }}
                      >
                        Activar Proxy QA
                      </button>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                      Sitios con <code>X-Frame-Options</code> bloquean iframes. El Proxy QA remueve esa restricción.
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SECCIÓN: RANGOS RESPONSIVE (BREAKPOINTS EXACTOS) */}
              {!isMultiView && (
                <div className="sidebar-group mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">
                      <i className="bi bi-rulers me-1 text-primary"></i> Rangos Responsive
                    </label>
                    <span className={`badge ${activeBreakpointRange.badgeClass} small`}>
                      {activeBreakpointRange.name}
                    </span>
                  </div>

                  <div className="accordion-breakpoint-list d-flex flex-column gap-2">
                    {RESPONSIVE_BREAKPOINTS.map((rangeItem) => {
                      const isActiveRange = activeBreakpointRange.id === rangeItem.id;
                      return (
                        <div
                          key={rangeItem.id}
                          className={`breakpoint-card p-2 rounded border ${
                            isActiveRange ? 'border-primary active-range-card' : 'bg-surface'
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small fw-bold d-flex align-items-center gap-1">
                              <i className={`bi ${rangeItem.icon}`}></i> {rangeItem.title}
                            </span>
                            <span className="badge bg-secondary-subtle text-body-secondary font-monospace" style={{ fontSize: '0.68rem' }}>
                              {rangeItem.range}
                            </span>
                          </div>

                          {/* Quick dimension buttons inside range */}
                          <div className="d-flex flex-wrap gap-1">
                            {rangeItem.pills.map((pill) => {
                              const isSelected = activeWidth === pill.width;
                              return (
                                <button
                                  key={pill.label}
                                  type="button"
                                  className={`btn btn-xs ${
                                    isSelected ? 'btn-primary fw-bold' : 'btn-outline-secondary'
                                  }`}
                                  onClick={() => handleSelectBreakpointPill(pill)}
                                  title={`${pill.name} - Rango ${rangeItem.range}`}
                                >
                                  {pill.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. SECCIÓN: DISPOSITIVOS ESPECÍFICOS */}
              {!isMultiView && (
                <div className="sidebar-group mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase mb-2">
                    <i className="bi bi-display me-1 text-primary"></i> Catálogo de Dispositivos
                  </label>

                  {/* Category Filter Pills */}
                  <div className="btn-group btn-group-sm w-100 mb-2" role="group">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'mobile', label: 'Móvil' },
                      { id: 'tablet', label: 'Tablet' },
                      { id: 'desktop', label: 'PC' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`btn ${categoryFilter === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Device Selector Dropdown */}
                  <div className="dropdown mb-2" ref={dropdownRef}>
                    <button
                      className="btn btn-sm btn-outline-primary w-100 dropdown-toggle d-flex align-items-center justify-content-between"
                      type="button"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      aria-expanded={isDropdownOpen}
                    >
                      <span className="d-flex align-items-center gap-2 text-truncate">
                        <i className={`bi ${isCustomMode ? 'bi-sliders' : selectedDevice.icon}`}></i>
                        <span className="fw-semibold text-truncate">
                          {isCustomMode ? 'Personalizado' : selectedDevice.name}
                        </span>
                      </span>
                      <span className="badge bg-light text-dark border ms-1">
                        {activeWidth} × {activeHeight}
                      </span>
                    </button>
                    <ul
                      className={`dropdown-menu shadow-lg dropdown-menu-device-list w-100 ${isDropdownOpen ? 'show' : ''}`}
                      style={{ display: isDropdownOpen ? 'block' : 'none' }}
                    >
                      <li className="dropdown-header text-uppercase small fw-bold">Dispositivos</li>
                      {displayedDevices.map((device) => (
                        <li key={device.id}>
                          <button
                            type="button"
                            className={`dropdown-item d-flex align-items-center justify-content-between gap-2 ${
                              !isCustomMode && selectedDevice.id === device.id ? 'active' : ''
                            }`}
                            onClick={() => {
                              handleDeviceChange(device);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="d-flex align-items-center gap-2 text-truncate">
                              <i className={`bi ${device.icon}`}></i> {device.name}
                            </span>
                            <span className="badge bg-secondary-subtle text-secondary small">
                              {device.width} × {device.height}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          type="button"
                          className={`dropdown-item d-flex align-items-center gap-2 ${isCustomMode ? 'active' : ''}`}
                          onClick={() => {
                            handleSelectCustom();
                            setIsDropdownOpen(false);
                          }}
                        >
                          <i className="bi bi-sliders"></i> Dimensión Numérica Libre...
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Custom Dimensions Form */}
                  {isCustomMode && (
                    <div className="p-2 rounded border bg-surface mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="input-group input-group-sm">
                          <span className="input-group-text px-2">W</span>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={customWidth}
                            min="200"
                            max="3840"
                            onChange={(e) => setCustomWidth(parseInt(e.target.value) || 300)}
                          />
                        </div>
                        <span>×</span>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text px-2">H</span>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={customHeight}
                            min="200"
                            max="3840"
                            onChange={(e) => setCustomHeight(parseInt(e.target.value) || 300)}
                          />
                        </div>
                        <span className="small text-muted">px</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. SECCIÓN: ORIENTACIÓN Y APARIENCIA */}
              {!isMultiView && (
                <div className="sidebar-group mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase mb-2">
                    <i className="bi bi-aspect-ratio me-1 text-primary"></i> Orientación y Chasis
                  </label>
                  <div className="d-flex gap-2 mb-2">
                    {/* Rotate button */}
                    <button
                      type="button"
                      className={`btn btn-sm w-50 ${isRotated ? 'btn-info' : 'btn-outline-secondary'} d-flex align-items-center justify-content-center gap-1`}
                      onClick={handleRotate}
                      title="Girar orientación de pantalla"
                    >
                      <i className="bi bi-arrow-repeat"></i>
                      <span>{isRotated ? 'Rotado' : 'Natural'}</span>
                    </button>

                    {/* Bezel / Chassis button */}
                    <button
                      type="button"
                      className={`btn btn-sm w-50 ${showBezel ? 'btn-outline-primary active' : 'btn-outline-secondary'} d-flex align-items-center justify-content-center gap-1`}
                      onClick={() => setShowBezel(!showBezel)}
                      title="Alternar marco de chasis realista o modo canvas"
                    >
                      <i className={`bi ${showBezel ? 'bi-bounding-box-circles' : 'bi-bounding-box'}`}></i>
                      <span>{showBezel ? 'Con Marco' : 'Sin Marco'}</span>
                    </button>
                  </div>

                  {/* Barra de Scroll */}
                  <div className="mt-3 pt-2 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted fw-semibold">Barra de Scroll:</span>
                      <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
                        {scrollbarMode === 'hidden' ? 'Oculta (Móvil)' : scrollbarMode === 'thin' ? 'Fina (4px)' : 'Estándar'}
                      </span>
                    </div>
                    <div className="btn-group btn-group-sm w-100" role="group" aria-label="Modo de barra de scroll">
                      <button
                        type="button"
                        className={`btn ${scrollbarMode === 'hidden' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => {
                          setScrollbarMode('hidden');
                          if (useProxy) {
                            setIsLoadingIframe(true);
                            setRefreshKey((prev) => prev + 1);
                          }
                        }}
                        title="Oculta (Como en dispositivos móviles reales)"
                      >
                        <i className="bi bi-eye-slash me-1"></i> Oculta
                      </button>
                      <button
                        type="button"
                        className={`btn ${scrollbarMode === 'thin' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => {
                          setScrollbarMode('thin');
                          if (useProxy) {
                            setIsLoadingIframe(true);
                            setRefreshKey((prev) => prev + 1);
                          }
                        }}
                        title="Fina (4px ultra delgada)"
                      >
                        <i className="bi bi-distribute-vertical me-1"></i> Fina
                      </button>
                      <button
                        type="button"
                        className={`btn ${scrollbarMode === 'default' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => {
                          setScrollbarMode('default');
                          if (useProxy) {
                            setIsLoadingIframe(true);
                            setRefreshKey((prev) => prev + 1);
                          }
                        }}
                        title="Estándar de escritorio"
                      >
                        <i className="bi bi-view-stacked me-1"></i> Normal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SECCIÓN: ZOOM Y ESCALA */}
              {!isMultiView && (
                <div className="sidebar-group mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-0">
                      <i className="bi bi-zoom-in me-1 text-primary"></i> Escala / Zoom
                    </label>
                    <span className="badge bg-secondary-subtle text-secondary font-monospace">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${isAutoFit ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1`}
                      onClick={() => setIsAutoFit(true)}
                    >
                      <i className="bi bi-arrows-angle-expand me-1"></i> Auto-Fit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setIsAutoFit(false);
                        setZoomLevel((prev) => Math.max(0.2, Math.round((prev - 0.1) * 10) / 10));
                      }}
                      title="Reducir zoom"
                    >
                      <i className="bi bi-dash"></i>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setIsAutoFit(false);
                        setZoomLevel((prev) => Math.min(2, Math.round((prev + 0.1) * 10) / 10));
                      }}
                      title="Aumentar zoom"
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  {/* Preset scale buttons */}
                  <div className="d-flex gap-1 justify-content-between">
                    {[0.4, 0.6, 0.8, 1].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        className={`btn btn-xs ${!isAutoFit && zoomLevel === scale ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1`}
                        onClick={() => {
                          setIsAutoFit(false);
                          setZoomLevel(scale);
                        }}
                      >
                        {Math.round(scale * 100)}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. SECCIÓN: TEMA CLARO / OSCURO */}
              <div className="sidebar-group mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-muted text-uppercase mb-0">
                    <i className="bi bi-circle-half me-1 text-primary"></i> Modo Claro / Oscuro
                  </label>
                  <span className={`badge ${simulatedTheme === 'dark' ? 'bg-dark text-warning border border-secondary' : 'bg-light text-dark border'}`} style={{ fontSize: '0.7rem' }}>
                    {simulatedTheme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
                  </span>
                </div>

                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${simulatedTheme === 'light' ? 'btn-primary fw-bold' : 'btn-outline-secondary'} d-flex align-items-center justify-content-center gap-1`}
                    onClick={() => {
                      setSimulatedTheme('light');
                      setIsLoadingIframe(true);
                      setRefreshKey((prev) => prev + 1);
                    }}
                  >
                    <i className="bi bi-sun-fill text-warning"></i>
                    <span>Modo Claro</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${simulatedTheme === 'dark' ? 'btn-primary fw-bold' : 'btn-outline-secondary'} d-flex align-items-center justify-content-center gap-1`}
                    onClick={() => {
                      setSimulatedTheme('dark');
                      setIsLoadingIframe(true);
                      setRefreshKey((prev) => prev + 1);
                    }}
                  >
                    <i className="bi bi-moon-stars-fill text-warning"></i>
                    <span>Modo Oscuro</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* =========================================================
            RIGHT MAIN VIEWPORT: SIMULATOR CANVAS
            ========================================================= */}
        <main className="simulator-main-viewport">
          {/* Canvas Header Ribbon */}
          <div className="canvas-header-ribbon d-flex flex-wrap align-items-center justify-content-between gap-2 p-2 px-3 border-bottom">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {!isSidebarOpen && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  onClick={() => setIsSidebarOpen(true)}
                  title="Mostrar panel de configuración"
                >
                  <i className="bi bi-layout-sidebar-inset"></i>
                  <span className="small fw-semibold">Opciones</span>
                </button>
              )}

              {/* Range Badge from Table */}
              <span className={`badge ${activeBreakpointRange.badgeClass} d-flex align-items-center gap-1`}>
                <i className={`bi ${activeBreakpointRange.icon}`}></i>
                <span>{activeBreakpointRange.name}</span>
                <span className="opacity-75">({activeBreakpointRange.range})</span>
              </span>

              {/* Exact Dimensions Chip */}
              <span className="info-chip">
                <i className="bi bi-aspect-ratio text-primary me-1"></i>
                <strong>{activeWidth} × {activeHeight} px</strong>
              </span>

              <span className="info-chip d-none d-sm-inline-flex">
                Ratio: {(activeWidth / activeHeight).toFixed(2)} ({activeWidth > activeHeight ? 'Horizontal' : 'Vertical'})
              </span>

              <span className="info-chip font-monospace d-none d-lg-inline-flex">
                @media (max-width: {activeWidth}px)
              </span>

              {/* Touch & Drag Active Badge */}
              <span className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-1" title="Toques táctiles, deslizamiento horizontal y clics habilitados">
                <i className="bi bi-hand-index-thumb"></i>
                <span>Touch & Drag Activo</span>
              </span>

              {useProxy && (
                <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                  <i className="bi bi-shield-check"></i> Proxy QA + Swipe
                </span>
              )}

              {/* Fast Scrollbar Switcher in header */}
              <button
                type="button"
                className="btn btn-xs btn-outline-secondary d-flex align-items-center gap-1 shadow-none"
                onClick={() => {
                  const nextMode = scrollbarMode === 'hidden' ? 'thin' : scrollbarMode === 'thin' ? 'default' : 'hidden';
                  setScrollbarMode(nextMode);
                  if (useProxy) {
                    setIsLoadingIframe(true);
                    setRefreshKey((prev) => prev + 1);
                  }
                }}
                title={`Scrollbar: ${scrollbarMode === 'hidden' ? 'Oculta (Móvil)' : scrollbarMode === 'thin' ? 'Fina (4px)' : 'Estándar'}. Clic para alternar.`}
              >
                <i className={`bi ${scrollbarMode === 'hidden' ? 'bi-eye-slash' : scrollbarMode === 'thin' ? 'bi-distribute-vertical' : 'bi-view-stacked'}`}></i>
                <span>Scroll: {scrollbarMode === 'hidden' ? 'Oculto' : scrollbarMode === 'thin' ? 'Fino (4px)' : 'Normal'}</span>
              </button>

              {/* Fast Theme Switcher in header */}
              <button
                type="button"
                className={`btn btn-xs ${
                  simulatedTheme === 'dark' ? 'btn-dark text-warning border-secondary' : 'btn-light text-dark border'
                } d-flex align-items-center gap-1 shadow-none`}
                onClick={() => {
                  const nextTheme = simulatedTheme === 'dark' ? 'light' : 'dark';
                  setSimulatedTheme(nextTheme);
                  setIsLoadingIframe(true);
                  setRefreshKey((prev) => prev + 1);
                }}
                title="Alternar tema Claro / Oscuro"
              >
                <i className={`bi ${simulatedTheme === 'dark' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
                <span>{simulatedTheme === 'dark' ? 'Oscuro' : 'Claro'}</span>
              </button>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted text-truncate" style={{ maxWidth: '260px' }} title={effectiveUrl}>
                <i className="bi bi-globe me-1"></i> {activeUrl}
              </span>
              <button
                type="button"
                className="btn btn-xs btn-outline-secondary"
                onClick={handleRefresh}
                title="Recargar"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>

          {/* Simulator Canvas Area */}
          {!isMultiView ? (
            <div className="simulator-canvas-container" ref={canvasContainerRef}>
              <div
                className="simulator-scaler"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                }}
              >
                {showBezel ? (
                  /* Realistic Device Chassis Frame */
                  <div
                    className={`device-chassis chassis-${
                      activeWidth >= 1440
                        ? 'monitor'
                        : activeWidth >= 1024
                        ? 'laptop'
                        : activeWidth >= 768
                        ? 'tablet'
                        : isCustomMode
                        ? 'custom'
                        : selectedDevice.frameType
                    } ${activeWidth > activeHeight ? 'is-landscape' : 'is-portrait'}`}
                    style={{
                      width: `${activeWidth}px`,
                      height: `${activeHeight}px`,
                    }}
                  >
                    {/* Laptop Bezel Bar (for laptop screens 1024px to 1439px) */}
                    {activeWidth >= 1024 && activeWidth < 1440 && (
                      <div className="chassis-laptop-bar">
                        <div className="laptop-camera"></div>
                      </div>
                    )}

                    {/* Monitor Top Camera / Status Bar (for desktop screens >= 1440px) */}
                    {activeWidth >= 1440 && (
                      <div className="chassis-monitor-bar">
                        <div className="monitor-camera"></div>
                      </div>
                    )}

                    {/* Screen Frame with Iframe (Clean screen, no dynamic island or overlays) */}
                    <div className={`device-screen theme-${simulatedTheme} scrollbar-${scrollbarMode}`}>
                      {isLoadingIframe && (
                        <div className="iframe-loader">
                          <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                          <span className="small text-muted mb-2">Cargando {inputUrl}...</span>
                          <button
                            type="button"
                            className="btn btn-xs btn-outline-light py-0 px-2 opacity-75"
                            onClick={() => setIsLoadingIframe(false)}
                            title="Omitir pantalla de carga si el sitio ya cargó"
                          >
                            Interactuar ya
                          </button>
                        </div>
                      )}
                      <iframe
                        key={`${refreshKey}-${simulatedTheme}-${enableSandbox}`}
                        src={effectiveUrl}
                        title={`Simulador ${activeWidth}x${activeHeight}`}
                        className={`device-iframe theme-${simulatedTheme}`}
                        style={{ colorScheme: simulatedTheme }}
                        onLoad={() => setIsLoadingIframe(false)}
                        onError={() => setIsLoadingIframe(false)}
                        allow="accelerometer; ambient-light-sensor; autoplay; camera; clipboard-read; clipboard-write; display-capture; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; wake-lock; screen-wake-lock; web-share"
                        {...(enableSandbox
                          ? {
                              sandbox:
                                'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-storage-access-by-user-activation',
                            }
                          : {})}
                      />
                    </div>

                    {/* Realistic Laptop Base (Keyboard chin with indent) */}
                    {activeWidth >= 1024 && activeWidth < 1440 && (
                      <div className="chassis-laptop-base">
                        <div className="laptop-notch-indent"></div>
                      </div>
                    )}

                    {/* Realistic Monitor Stand & Desk Base (for screens >= 1440px) */}
                    {activeWidth >= 1440 && (
                      <div className="chassis-monitor-stand">
                        <div className="monitor-neck"></div>
                        <div className="monitor-foot"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Clean Canvas View without Bezel */
                  <div
                    className={`clean-viewport-canvas scrollbar-${scrollbarMode}`}
                    style={{
                      width: `${activeWidth}px`,
                      height: `${activeHeight}px`,
                    }}
                  >
                    <div className="ruler-tag ruler-width">{activeWidth} px</div>
                    <div className="ruler-tag ruler-height">{activeHeight} px</div>

                    {isLoadingIframe && (
                      <div className="iframe-loader">
                        <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
                        <span className="small text-muted mb-2">Cargando...</span>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline-light py-0 px-2 opacity-75"
                          onClick={() => setIsLoadingIframe(false)}
                          title="Omitir pantalla de carga si el sitio ya cargó"
                        >
                          Interactuar ya
                        </button>
                      </div>
                    )}
                    <iframe
                      key={`${refreshKey}-${simulatedTheme}-${enableSandbox}`}
                      src={effectiveUrl}
                      title="Simulador Canvas"
                      className={`device-iframe theme-${simulatedTheme}`}
                      style={{ colorScheme: simulatedTheme }}
                      onLoad={() => setIsLoadingIframe(false)}
                      onError={() => setIsLoadingIframe(false)}
                      allow="accelerometer; ambient-light-sensor; autoplay; camera; clipboard-read; clipboard-write; display-capture; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; wake-lock; screen-wake-lock; web-share"
                      {...(enableSandbox
                        ? {
                            sandbox:
                              'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-storage-access-by-user-activation',
                          }
                        : {})}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Multi-Device Parallel View inside Right Canvas */
            <div className="multi-view-container p-3">
              <div className="row g-3 justify-content-center">
                {multiViewDevices.map((dev) => (
                  <div key={dev.id} className="col-12 col-xl-4 col-lg-6 d-flex flex-column align-items-center">
                    <div className="multi-device-card w-100 p-3 rounded shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <i className={`bi ${dev.icon} text-primary fs-5`}></i>
                          <div>
                            <div className="fw-bold small">{dev.label}</div>
                            <div className="small text-muted">{dev.name}</div>
                          </div>
                        </div>
                        <span className="badge bg-dark-subtle text-body font-monospace">
                          {dev.width} × {dev.height} px
                        </span>
                      </div>

                      <div
                        className="multi-screen-container"
                        style={{
                          height: '520px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            transform: `scale(${Math.min(1, 350 / dev.width)})`,
                            transformOrigin: 'top center',
                            width: `${dev.width}px`,
                            height: `${dev.height}px`,
                            margin: '0 auto',
                          }}
                        >
                          <iframe
                            key={`${refreshKey}-${dev.id}-${simulatedTheme}-${enableSandbox}`}
                            src={effectiveUrl}
                            title={`Multi-View ${dev.name}`}
                            className={`device-iframe border rounded shadow theme-${simulatedTheme}`}
                            style={{ width: `${dev.width}px`, height: `${dev.height}px`, colorScheme: simulatedTheme }}
                            allow="accelerometer; ambient-light-sensor; autoplay; camera; clipboard-read; clipboard-write; display-capture; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; wake-lock; screen-wake-lock; web-share"
                            {...(enableSandbox
                              ? {
                                  sandbox:
                                    'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-storage-access-by-user-activation',
                                }
                              : {})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

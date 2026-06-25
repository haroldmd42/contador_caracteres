import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CardTools } from '../../components/CardsTools/CardTools';
import { TOOLS } from '../../constants/tools';
import { ROUTES } from '../../constants/routes';
import './Home.css';

/**
 * Home page — Redesigned landing dashboard.
 * Separates core file converters from auxiliary developer/QA utility tools.
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Map route links to custom colors and classes for the premium UI
  const getPremiumCardMeta = (link) => {
    switch (link) {
      case ROUTES.FILE_CONVERTER:
        return { styleClass: 'doc', badgeText: 'Documentos' };
      case ROUTES.IMAGE_CONVERTER:
        return { styleClass: 'img', badgeText: 'Imágenes' };
      case ROUTES.VIDEO_CONVERTER:
        return { styleClass: 'vid', badgeText: 'Video' };
      case ROUTES.AUDIO_CONVERTER:
        return { styleClass: 'aud', badgeText: 'Audio' };
      default:
        return { styleClass: 'doc', badgeText: 'Conversor' };
    }
  };

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Split converters and utilities for premium dashboard view
  const { primaryConverters, additionalUtilities } = useMemo(() => {
    const converters = TOOLS.filter(t => t.category === 'converter');
    const utilities = TOOLS.filter(t => t.category !== 'converter');
    return {
      primaryConverters: converters,
      additionalUtilities: utilities
    };
  }, []);

  const isBrowsingDefaultDashboard = useMemo(() => {
    return !searchQuery && selectedCategory === 'all';
  }, [searchQuery, selectedCategory]);

  return (
    <div className="home-dashboard">
      {/* Premium Hero Section */}
      <header className="hero-section text-center">
        <div className="container">
          <span className="hero-badge">Herramientas Profesionales para aumentar tu Productividad</span>
          <h1 className="hero-title">
            Herramientas esenciales para <span className="text-gradient">QA y desarrolladores</span>
          </h1>
          <p className="hero-subtitle">
            Optimiza tu flujo de trabajo con utilidades diseñadas para pruebas, desarrollo y productividad. Convierte documentos, imágenes, audio y video directamente en tu navegador.
          </p>

          {/* Search bar */}
          <div className="search-container col-md-8 col-lg-6 mx-auto">
            <div className="search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Busca convertidores o herramientas por nombre..."
                className="form-control search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar herramientas"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content & Tools Grid */}
      <main className="container dashboard-content">
        {/* Category Filters */}
        <div className="filters-container d-flex flex-wrap justify-content-center gap-2 mb-5 mx-auto">
          {[
            { id: 'all', label: 'Ver Todo', icon: 'bi-grid-fill' },
            { id: 'converter', label: 'Convertidores Core', icon: 'bi-file-earmark-arrow-up-fill' },
            { id: 'text', label: 'Texto y Utilidades', icon: 'bi-file-earmark-text-fill' },
            { id: 'image', label: 'Multimedia e Imagen', icon: 'bi-image-fill' },
            { id: 'qa', label: 'Biblioteca de Archivos', icon: 'bi-folder-fill' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn d-flex align-items-center gap-2 ${
                selectedCategory === cat.id ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard layouts */}
        {isBrowsingDefaultDashboard ? (
          /* Premium Default View: Grouped Sections */
          <div className="d-flex flex-column gap-5">
            {/* 1. Core Converters Dashboard */}
            <div>
              <h3 className="section-title-premium mb-4">Módulos Principales de Conversión</h3>
              <div className="converters-panel">
                <div className="row g-4">
                  {primaryConverters.map((tool) => {
                    const meta = getPremiumCardMeta(tool.link);
                    return (
                      <div key={tool.link} className="col-sm-12 col-md-6 col-lg-3 premium-card-wrapper">
                        <div className={`premium-converter-card ${meta.styleClass}`}>
                          <span className="premium-card-badge">{meta.badgeText}</span>
                          <div className="premium-card-icon">
                            <i className={`bi ${tool.icon}`}></i>
                          </div>
                          <h4 className="premium-card-title">{tool.title}</h4>
                          <p className="premium-card-description">{tool.description}</p>
                          <Link to={tool.link} className="premium-card-action">
                            Iniciar Conversión <i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Additional Utilities */}
            <div>
              <h3 className="section-title-premium mb-4">Herramientas de Productividad</h3>
              <div className="row g-4">
                {additionalUtilities.map((tool) => (
                  <div key={tool.link} className="col-sm-12 col-md-6 col-lg-4">
                    <CardTools
                      title={tool.title}
                      description={tool.description}
                      link={tool.link}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Filtered/Search View: Unified Grid */
          <div>
            <div className="results-info d-flex justify-content-between align-items-center mb-4">
              <span className="results-count">
                Mostrando <strong>{filteredTools.length}</strong> {filteredTools.length === 1 ? 'herramienta' : 'herramientas'}
              </span>
              <button
                className="btn-reset-filters btn btn-link text-decoration-none btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Restablecer filtros
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="tools-grid-redesigned row g-4">
                {filteredTools.map((tool) => (
                  <div key={tool.link} className="col-sm-12 col-md-6 col-lg-4">
                    <CardTools
                      title={tool.title}
                      description={tool.description}
                      link={tool.link}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="empty-state text-center py-5">
                <div className="empty-icon-wrapper mb-3 mx-auto">
                  <i className="bi bi-search-heart empty-icon"></i>
                </div>
                <h3>No se encontraron herramientas</h3>
                <p className="text-muted">
                  Prueba buscando con otros términos o cambia la categoría de filtro seleccionada.
                </p>
                <button
                  className="btn btn-primary mt-2 px-4 rounded-pill"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Ver todas las herramientas
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
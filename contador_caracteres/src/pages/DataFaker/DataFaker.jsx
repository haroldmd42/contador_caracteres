import { useState, useCallback } from 'react';
import useClipboard from '../../hooks/useClipboard';
import Toast from '../../components/ui/Toast/Toast';
import './DataFaker.css';

/** Algorithm for Colombian NIT Verification Digit (DIAN Módulo 11) */
function calculateColombianNitDv(nitNumber) {
  const primes = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const numStr = String(nitNumber).replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < numStr.length; i++) {
    const digit = parseInt(numStr.charAt(numStr.length - 1 - i), 10);
    sum += digit * primes[i];
  }
  const remainder = sum % 11;
  if (remainder > 1) return String(11 - remainder);
  return String(remainder);
}

/** Algorithm for Chilean RUT DV */
function calculateChileanRutDv(rutNumber) {
  let sum = 0;
  let multiplier = 2;
  const numStr = String(rutNumber).split('').reverse().join('');
  for (let i = 0; i < numStr.length; i++) {
    sum += parseInt(numStr[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const res = 11 - (sum % 11);
  if (res === 11) return '0';
  if (res === 10) return 'K';
  return String(res);
}

/** Algorithm for Spanish NIF Letter */
function calculateSpanishNifLetter(dniNumber) {
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  return letters[dniNumber % 23];
}

/** Luhn algorithm check digit generator for credit cards */
function generateLuhnCreditCard(prefix, length) {
  let card = prefix;
  while (card.length < length - 1) {
    card += Math.floor(Math.random() * 10);
  }
  let sum = 0;
  let shouldDouble = true;
  for (let i = card.length - 1; i >= 0; i--) {
    let digit = parseInt(card.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return card + checkDigit;
}

const COLOMBIAN_NAMES = ['Santiago', 'Valentina', 'Mateo', 'Mariana', 'Samuel', 'Isabella', 'Nicolás', 'Camila', 'Alejandro', 'Salomé', 'Daniel', 'Luciana', 'Andrés', 'Gabriela'];
const COLOMBIAN_LAST_NAMES = ['Rodríguez', 'Gómez', 'González', 'Martínez', 'García', 'López', 'Hernández', 'Sánchez', 'Pérez', 'Ramírez', 'Torres', 'Díaz', 'Vargas', 'Rojas'];
const DOMAINS = ['testmail.com', 'qa-colombia.org', 'dispostable.com', 'mailinator.com', 'empresa-test.co'];
const COLOMBIAN_CITIES = ['Bogotá, D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Cúcuta'];
const COLOMBIAN_ADDRESSES = ['Calle 100 # 15-24', 'Carrera 43A # 1-50', 'Calle 26 # 68C-61', 'Avenida El Poblado # 5-30', 'Carrera 7 # 71-21', 'Calle 53 # 45-12'];

export default function DataFaker() {
  const [activeTab, setActiveTab] = useState('documents');
  const [documentType, setDocumentType] = useState('nit_co');
  const [cardBrand, setCardBrand] = useState('visa');
  const [mockCount, setMockCount] = useState(5);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  // Generate Document
  const handleGenerateDocument = useCallback(() => {
    let result = '';
    if (documentType === 'nit_co') {
      const num = Math.floor(800000000 + Math.random() * 199999999);
      const dv = calculateColombianNitDv(num);
      result = `NIT Colombia (DIAN): ${num}-${dv}`;
    } else if (documentType === 'cedula_co') {
      const isNewRange = Math.random() > 0.4;
      const num = isNewRange
        ? Math.floor(1000000000 + Math.random() * 999999999)
        : Math.floor(10000000 + Math.random() * 89999999);
      result = `Cédula de Ciudadanía (Colombia): ${num.toLocaleString('es-CO')}`;
    } else if (documentType === 'ce_co') {
      const num = Math.floor(300000 + Math.random() * 699999);
      result = `Cédula de Extranjería (Colombia): ${num}`;
    } else if (documentType === 'ti_co') {
      const num = Math.floor(1000000000 + Math.random() * 999999999);
      result = `Tarjeta de Identidad (Colombia): ${num}`;
    } else if (documentType === 'rut_cl') {
      const num = Math.floor(10000000 + Math.random() * 15000000);
      const dv = calculateChileanRutDv(num);
      result = `RUT Chile: ${num}-${dv}`;
    } else if (documentType === 'nif_es') {
      const num = Math.floor(10000000 + Math.random() * 89999999);
      const letter = calculateSpanishNifLetter(num);
      result = `NIF España: ${num}${letter}`;
    }
    setGeneratedOutput(result);
  }, [documentType]);

  // Generate Credit Card
  const handleGenerateCreditCard = useCallback(() => {
    let prefix = '4532';
    let len = 16;
    if (cardBrand === 'mastercard') prefix = '5425';
    if (cardBrand === 'amex') { prefix = '3782'; len = 15; }

    const cardNumber = generateLuhnCreditCard(prefix, len);
    const expMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const expYear = String(new Date().getFullYear() + Math.floor(1 + Math.random() * 5));
    const cvv = len === 15 ? String(Math.floor(1000 + Math.random() * 8999)) : String(Math.floor(100 + Math.random() * 899));

    const cardDetails = `Número: ${cardNumber}\nVencimiento: ${expMonth}/${expYear}\nCVV: ${cvv}\nMarca: ${cardBrand.toUpperCase()}`;
    setGeneratedOutput(cardDetails);
  }, [cardBrand]);

  // Generate Profile
  const handleGenerateProfile = useCallback(() => {
    const fn = COLOMBIAN_NAMES[Math.floor(Math.random() * COLOMBIAN_NAMES.length)];
    const ln = COLOMBIAN_LAST_NAMES[Math.floor(Math.random() * COLOMBIAN_LAST_NAMES.length)];
    const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random()*999)}@${domain}`;
    const phone = `+57 3${Math.floor(0 + Math.random() * 3)}${Math.floor(0 + Math.random() * 9)} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(1000 + Math.random() * 8999)}`;
    const city = COLOMBIAN_CITIES[Math.floor(Math.random() * COLOMBIAN_CITIES.length)];
    const address = COLOMBIAN_ADDRESSES[Math.floor(Math.random() * COLOMBIAN_ADDRESSES.length)];
    const ccNum = Math.floor(1000000000 + Math.random() * 99999999);

    const profile = `Nombre Completo: ${fn} ${ln}\nCédula de Ciudadanía: ${ccNum}\nEmail: ${email}\nTeléfono Celular: ${phone}\nCiudad: ${city}\nDirección: ${address}`;
    setGeneratedOutput(profile);
  }, []);

  // Generate JSON Payload Batch
  const handleGenerateJsonPayload = useCallback(() => {
    const list = [];
    const count = Math.min(Math.max(1, mockCount), 100);
    for (let i = 0; i < count; i++) {
      const fn = COLOMBIAN_NAMES[Math.floor(Math.random() * COLOMBIAN_NAMES.length)];
      const ln = COLOMBIAN_LAST_NAMES[Math.floor(Math.random() * COLOMBIAN_LAST_NAMES.length)];
      const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
      const nitNum = Math.floor(800000000 + Math.random() * 199999999);
      const nitDv = calculateColombianNitDv(nitNum);
      const city = COLOMBIAN_CITIES[Math.floor(Math.random() * COLOMBIAN_CITIES.length)];

      list.push({
        id: i + 1,
        uuid: crypto.randomUUID(),
        nombre: fn,
        apellido: ln,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@${domain}`,
        cedula: String(Math.floor(1000000000 + Math.random() * 99999999)),
        nitEmpresa: `${nitNum}-${nitDv}`,
        telefono: `+57 3${Math.floor(100000009 + Math.random() * 899999990)}`,
        ciudad: city,
        activo: Math.random() > 0.2,
        creadoEn: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
      });
    }
    setGeneratedOutput(JSON.stringify(list, null, 2));
  }, [mockCount]);

  return (
    <div className="container py-5">
      <Toast message="Copiado al portapapeles" visible={copied} />
      <div className="header-section text-center mb-4">
        <h1><i className="bi bi-person-vcard text-primary me-2"></i>Generador de Datos QA (Faker Colombia)</h1>
        <p className="subtitle-text">Genera datos de prueba válidos para formularios en Colombia: NIT con Dígito de Verificación (DIAN), Cédula de Ciudadanía, celulares, tarjetas Luhn y JSONs mock.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card custom-card p-4 border-0 shadow-lg h-100">
            <h4 className="fw-bold mb-3"><i className="bi bi-sliders me-2"></i>Tipo de Datos</h4>
            
            <div className="btn-group w-100 mb-4 flex-wrap" role="group">
              <button className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('documents')}>Documentos (CO)</button>
              <button className={`btn ${activeTab === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('cards')}>Tarjetas</button>
              <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('profile')}>Perfil CO</button>
              <button className={`btn ${activeTab === 'json' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('json')}>Payload JSON</button>
            </div>

            {activeTab === 'documents' && (
              <div className="d-flex flex-column gap-3">
                <label className="fw-semibold">Seleccionar Documento:</label>
                <select className="form-select" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                  <option value="nit_co">🇨🇴 NIT Colombia (DV DIAN Módulo 11)</option>
                  <option value="cedula_co">🇨🇴 Cédula de Ciudadanía (Colombia)</option>
                  <option value="ce_co">🇨🇴 Cédula de Extranjería (Colombia)</option>
                  <option value="ti_co">🇨🇴 Tarjeta de Identidad (Colombia)</option>
                  <option value="rut_cl">🇨🇱 RUT (Chile) con DV</option>
                  <option value="nif_es">🇪🇸 NIF / DNI (España)</option>
                </select>
                <button className="btn btn-primary mt-2" onClick={handleGenerateDocument}><i className="bi bi-cpu me-2"></i>Generar Documento Válido</button>
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="d-flex flex-column gap-3">
                <label className="fw-semibold">Marca de Tarjeta (Algoritmo Luhn):</label>
                <select className="form-select" value={cardBrand} onChange={(e) => setCardBrand(e.target.value)}>
                  <option value="visa">Visa (16 dígitos)</option>
                  <option value="mastercard">MasterCard (16 dígitos)</option>
                  <option value="amex">American Express (15 dígitos)</option>
                </select>
                <button className="btn btn-primary mt-2" onClick={handleGenerateCreditCard}><i className="bi bi-credit-card-2-front me-2"></i>Generar Tarjeta de Prueba</button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="d-flex flex-column gap-3">
                <p className="subtitle-text small">Genera un perfil colombiano completo con Cédula, email, celular (+57), ciudad y dirección para pruebas E2E.</p>
                <button className="btn btn-primary mt-2" onClick={handleGenerateProfile}><i className="bi bi-person-plus me-2"></i>Generar Perfil Ficticio Colombia</button>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="d-flex flex-column gap-3">
                <label className="fw-semibold">Cantidad de Objetos a generar (1-100):</label>
                <input type="number" className="form-control" min={1} max={100} value={mockCount} onChange={(e) => setMockCount(parseInt(e.target.value, 10) || 1)} />
                <button className="btn btn-primary mt-2" onClick={handleGenerateJsonPayload}><i className="bi bi-filetype-json me-2"></i>Generar JSON Batch Colombia</button>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card custom-card p-4 border-0 shadow-lg h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0"><i className="bi bi-terminal me-2"></i>Resultado Generado</h4>
              {generatedOutput && (
                <button className="btn btn-sm btn-success" onClick={() => copyToClipboard(generatedOutput)}><i className="bi bi-clipboard me-1"></i>Copiar</button>
              )}
            </div>
            <textarea className="form-control custom-textarea flex-grow-1 font-monospace code-output" rows={12} readOnly value={generatedOutput} placeholder="Los datos generados aparecerán aquí..." />
          </div>
        </div>
      </div>
    </div>
  );
}

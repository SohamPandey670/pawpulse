import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  profileDataset,
  generateSmartSuggestions,
  executeDataQuery,
} from '../utils/aiDataEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  UploadCloud,
  FileSpreadsheet,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
  Table as TableIcon,
  Search,
  Download,
  Sparkles,
  RefreshCw,
  FileText,
  Layers,
  ArrowRight,
  TrendingUp,
  Hash,
  Database,
  Building2,
  Bot,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  X,
  Play,
} from 'lucide-react';

const PALETTE = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8', '#4ade80'];

// Pre-packaged sample datasets available on demand (NOT preloaded by default)
const OPTIONAL_SAMPLES = {
  clinicSales: {
    name: 'Clinic_Monthly_Revenue_2026.xlsx',
    data: [
      { Month: '2026-01', Clinic: 'PawCare Mumbai', Service: 'Teleconsult', Bookings: 145, Revenue: 87000, Rating: 4.8 },
      { Month: '2026-01', Clinic: 'PawCare Mumbai', Service: 'Surgery & Clinic', Bookings: 92, Revenue: 138000, Rating: 4.9 },
      { Month: '2026-01', Clinic: 'VetLife Pune', Service: 'Teleconsult', Bookings: 88, Revenue: 52800, Rating: 4.7 },
      { Month: '2026-01', Clinic: 'PetFirst Bangalore', Service: 'Home Visit', Bookings: 64, Revenue: 57600, Rating: 4.9 },
      { Month: '2026-02', Clinic: 'PawCare Mumbai', Service: 'Teleconsult', Bookings: 172, Revenue: 103200, Rating: 4.8 },
      { Month: '2026-02', Clinic: 'PawCare Mumbai', Service: 'Surgery & Clinic', Bookings: 110, Revenue: 165000, Rating: 4.9 },
      { Month: '2026-02', Clinic: 'VetLife Pune', Service: 'Teleconsult', Bookings: 105, Revenue: 63000, Rating: 4.6 },
      { Month: '2026-02', Clinic: 'PetFirst Bangalore', Service: 'Home Visit', Bookings: 78, Revenue: 70200, Rating: 4.8 },
      { Month: '2026-03', Clinic: 'PawCare Mumbai', Service: 'Teleconsult', Bookings: 198, Revenue: 118800, Rating: 4.9 },
      { Month: '2026-03', Clinic: 'PawCare Mumbai', Service: 'Surgery & Clinic', Bookings: 125, Revenue: 187500, Rating: 4.9 },
      { Month: '2026-03', Clinic: 'VetLife Pune', Service: 'Teleconsult', Bookings: 120, Revenue: 72000, Rating: 4.7 },
      { Month: '2026-03', Clinic: 'PetFirst Bangalore', Service: 'Home Visit', Bookings: 95, Revenue: 85500, Rating: 4.9 },
    ],
  },
  retailOrders: {
    name: 'Pet_Products_Orders.csv',
    data: [
      { OrderID: 'ORD-101', Category: 'Medicines', Product: 'Flea & Tick Spray', Units: 42, UnitPrice: 650, DiscountPct: 5, TotalAmount: 25935, CustomerCity: 'Mumbai' },
      { OrderID: 'ORD-102', Category: 'Supplements', Product: 'Omega 3 Fish Oil', Units: 85, UnitPrice: 850, DiscountPct: 10, TotalAmount: 65025, CustomerCity: 'Delhi' },
      { OrderID: 'ORD-103', Category: 'Medicines', Product: 'Canine Antibiotics', Units: 31, UnitPrice: 420, DiscountPct: 0, TotalAmount: 13020, CustomerCity: 'Bangalore' },
      { OrderID: 'ORD-104', Category: 'Grooming', Product: 'Herbal Shampoo', Units: 110, UnitPrice: 380, DiscountPct: 15, TotalAmount: 35530, CustomerCity: 'Pune' },
      { OrderID: 'ORD-105', Category: 'Food & Nutrition', Product: 'Puppy Kibble 10kg', Units: 65, UnitPrice: 2400, DiscountPct: 8, TotalAmount: 143520, CustomerCity: 'Hyderabad' },
      { OrderID: 'ORD-106', Category: 'Supplements', Product: 'Joint Support Tablets', Units: 54, UnitPrice: 950, DiscountPct: 12, TotalAmount: 45144, CustomerCity: 'Mumbai' },
      { OrderID: 'ORD-107', Category: 'Grooming', Product: 'Nail Grinder Pro', Units: 28, UnitPrice: 1200, DiscountPct: 5, TotalAmount: 31920, CustomerCity: 'Bangalore' },
      { OrderID: 'ORD-108', Category: 'Medicines', Product: 'Eye & Ear Drops', Units: 73, UnitPrice: 290, DiscountPct: 0, TotalAmount: 21170, CustomerCity: 'Chennai' },
    ],
  },
};

export default function DashboardStudio() {
  // 100% EMPTY by default as requested
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // AI Prompt State
  const [userQuery, setUserQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [clarificationPrompt, setClarificationPrompt] = useState(null);

  // Manual Controls Override
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const [selectedAgg, setSelectedAgg] = useState('sum');
  const [chartType, setChartType] = useState('bar');

  // Search & Table Explorer
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fileInputRef = useRef(null);

  // Profile Dataset with AI Engine
  const profile = useMemo(() => {
    if (!data || data.length === 0) return null;
    return profileDataset(data);
  }, [data]);

  // Smart Suggestions based on detected fields
  const suggestions = useMemo(() => {
    if (!profile) return [];
    return generateSmartSuggestions(profile);
  }, [profile]);

  // File Upload Parser (SheetJS xlsx & csv)
  const processRawFile = (file) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage('');
    setQueryResult(null);
    setClarificationPrompt(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!json || json.length === 0) {
          setErrorMessage('Uploaded spreadsheet appears empty or contains no data rows.');
          setIsProcessing(false);
          return;
        }

        setData(json);
        setFileName(file.name);

        // Auto-run first smart query
        const autoProfile = profileDataset(json);
        if (autoProfile) {
          const autoSuggestions = generateSmartSuggestions(autoProfile);
          if (autoSuggestions.length > 0) {
            const first = autoSuggestions[0];
            setSelectedX(first.dimension);
            setSelectedY(first.metric);
            setSelectedAgg(first.agg);
            setChartType(first.chartType);
            const res = executeDataQuery(first.query, json, autoProfile, first);
            setQueryResult(res);
          }
        }
      } catch (err) {
        console.error('File parse error:', err);
        setErrorMessage('Failed to parse file. Please verify it is a valid .csv, .xlsx, or .xls document.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processRawFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processRawFile(e.target.files[0]);
    }
  };

  const loadSample = (sampleKey) => {
    const sample = OPTIONAL_SAMPLES[sampleKey];
    if (!sample) return;
    setData(sample.data);
    setFileName(sample.name);
    setErrorMessage('');

    const autoProfile = profileDataset(sample.data);
    if (autoProfile) {
      const autoSuggestions = generateSmartSuggestions(autoProfile);
      if (autoSuggestions.length > 0) {
        const first = autoSuggestions[0];
        setSelectedX(first.dimension);
        setSelectedY(first.metric);
        setSelectedAgg(first.agg);
        setChartType(first.chartType);
        const res = executeDataQuery(first.query, sample.data, autoProfile, first);
        setQueryResult(res);
      }
    }
  };

  const resetAll = () => {
    setData(null);
    setFileName(null);
    setQueryResult(null);
    setClarificationPrompt(null);
    setUserQuery('');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Run AI Query / Operation
  const handleExecuteQuery = (e) => {
    e?.preventDefault();
    if (!userQuery.trim() || !data || !profile) return;

    setClarificationPrompt(null);
    const qLower = userQuery.toLowerCase();

    // Check for ambiguity
    if ((qLower.includes('revenue') || qLower.includes('sales') || qLower.includes('amount')) && profile.numericCols.length > 1 && !profile.numericCols.some(n => qLower.includes(n.name.toLowerCase()))) {
      setClarificationPrompt({
        question: `We noticed multiple numeric fields (${profile.numericCols.map(c => c.name).join(', ')}). Which specific field should we analyze?`,
        options: profile.numericCols.map(c => c.name),
        type: 'metric',
      });
      return;
    }

    const res = executeDataQuery(userQuery, data, profile, {
      chartType,
      agg: selectedAgg,
      dimension: selectedX,
      metric: selectedY,
    });

    if (res) {
      setQueryResult(res);
      setSelectedX(res.dimension);
      setSelectedY(res.metric);
      setSelectedAgg(res.agg);
      setChartType(res.chartType);
    }
  };

  const handleSuggestionClick = (sug) => {
    setUserQuery(sug.query);
    setSelectedX(sug.dimension);
    setSelectedY(sug.metric);
    setSelectedAgg(sug.agg);
    setChartType(sug.chartType);
    const res = executeDataQuery(sug.query, data, profile, sug);
    setQueryResult(res);
  };

  const handleClarificationSelect = (chosenValue) => {
    if (!clarificationPrompt) return;
    let newQuery = userQuery;
    if (clarificationPrompt.type === 'metric') {
      setSelectedY(chosenValue);
      newQuery = `${userQuery} using metric ${chosenValue}`;
    } else {
      setSelectedX(chosenValue);
      newQuery = `${userQuery} grouped by ${chosenValue}`;
    }
    setUserQuery(newQuery);
    setClarificationPrompt(null);

    const res = executeDataQuery(newQuery, data, profile, {
      chartType,
      agg: selectedAgg,
      dimension: clarificationPrompt.type === 'dimension' ? chosenValue : selectedX,
      metric: clarificationPrompt.type === 'metric' ? chosenValue : selectedY,
    });
    setQueryResult(res);
  };

  // Re-run query on manual dropdown changes
  const handleManualControlChange = (newX, newY, newAgg, newChart) => {
    setSelectedX(newX);
    setSelectedY(newY);
    setSelectedAgg(newAgg);
    setChartType(newChart);

    if (!data || !profile) return;
    const res = executeDataQuery('', data, profile, {
      chartType: newChart,
      agg: newAgg,
      dimension: newX,
      metric: newY,
    });
    setQueryResult(res);
  };

  // Table Explorer filtered and paginated
  const filteredTableData = useMemo(() => {
    if (!data) return [];
    if (!tableSearch.trim()) return data;
    const q = tableSearch.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [data, tableSearch]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTableData.slice(start, start + rowsPerPage);
  }, [filteredTableData, currentPage]);

  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage) || 1;

  const exportCurrentCsv = () => {
    if (!data || data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_${fileName || 'dataset'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="paw-dashboard-page" style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Studio Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Universal AI Auto-Dashboard Studio
              </h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Intelligent spreadsheet analytics & Power BI copilot for any CSV or Excel file
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {data && (
            <button
              onClick={resetAll}
              className="paw-btn paw-btn-secondary"
              title="Clear active file and start fresh"
            >
              <RefreshCw size={14} />
              <span>Upload New File</span>
            </button>
          )}

          <Link to="/dashboard" className="paw-btn paw-btn-primary" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Building2 size={15} />
            <span>🐾 Switch to Clinic Operations</span>
          </Link>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv, .xlsx, .xls"
        style={{ display: 'none' }}
      />

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="paw-alert paw-alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* =========================================================================
          STATE 1: EMPTY STATE (DEFAULT) — INVITING AI FILE DROPZONE
      ========================================================================== */}
      {!data && (
        <div style={{ maxWidth: '820px', margin: '40px auto' }}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragActive ? '2px dashed #06b6d4' : '2px dashed rgba(255, 255, 255, 0.15)',
              background: dragActive
                ? 'rgba(6, 182, 212, 0.08)'
                : 'radial-gradient(circle at center, rgba(15, 23, 42, 0.6) 0%, rgba(10, 14, 23, 0.8) 100%)',
              borderRadius: '20px',
              padding: '60px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <UploadCloud size={36} color="#67e8f9" />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Upload any CSV or Excel Spreadsheet
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
              Drag & drop your file here, or click to browse. The AI engine will inspect your columns, understand the domain, and build interactive dashboards instantly.
            </p>

            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="paw-badge badge-cyan">.CSV</span>
              <span className="paw-badge badge-indigo">.XLSX</span>
              <span className="paw-badge badge-emerald">.XLS</span>
              <span className="paw-badge badge-amber">100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Quick Sample Links Accordion */}
          <div
            style={{
              marginTop: '28px',
              padding: '18px 24px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} className="text-accent" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Don't have a spreadsheet right now? Test with pre-built data:
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => loadSample('clinicSales')}
                className="paw-btn paw-btn-xs paw-btn-secondary"
              >
                Clinic Revenue 2026 (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => loadSample('retailOrders')}
                className="paw-btn paw-btn-xs paw-btn-secondary"
              >
                Pet Products Orders (.csv)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STATE 2: ACTIVE FILE LOADED — AI INSIGHTS, COPILOT & POWER BI STUDIO
      ========================================================================== */}
      {data && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* AI Executive Summary Card */}
          <div
            className="paw-card"
            style={{
              padding: '20px 24px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              background: 'radial-gradient(circle at top left, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(6, 182, 212, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={22} className="text-cyan" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                      AI Dataset Intelligence: {fileName}
                    </h3>
                    <span className="paw-badge badge-cyan">{profile.domain}</span>
                    <span className="paw-badge badge-emerald">{profile.rowCount.toLocaleString()} Rows</span>
                    <span className="paw-badge badge-indigo">{profile.columnCount} Columns</span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                    {profile.summary}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={exportCurrentCsv}
                  className="paw-btn paw-btn-xs paw-btn-secondary"
                  title="Export processed dataset"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="paw-btn paw-btn-xs paw-btn-danger"
                  title="Close file and reset"
                >
                  <X size={13} />
                  <span>Close File</span>
                </button>
              </div>
            </div>

            {/* Field Breakdown Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.76rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Detected Metrics (Numeric):</span>
              {profile.numericCols.map((c) => (
                <span key={c.name} className="paw-badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  # {c.name} (avg: {c.avg.toLocaleString()})
                </span>
              ))}

              <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginLeft: '12px' }}>
                Dimensions (Grouping Keys):
              </span>
              {profile.categoricalCols.map((c) => (
                <span key={c.name} className="paw-badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                  🗂️ {c.name} ({c.uniqueCount} distinct)
                </span>
              ))}
            </div>
          </div>

          {/* AI Natural Language Query & Operations Copilot */}
          <div className="paw-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} className="text-accent" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                Ask AI / Execute Power BI Query
              </h3>
            </div>

            <form onSubmit={handleExecuteQuery} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Type an operation, e.g. 'Show revenue by clinic as bar chart' or 'Average bookings per service'..."
                className="paw-form-input"
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                className="paw-btn paw-btn-primary"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', padding: '12px 20px' }}
              >
                <Play size={15} />
                <span>Run Operation</span>
              </button>
            </form>

            {/* Clarification Dialog if AI asks for user input */}
            {clarificationPrompt && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 600, fontSize: '0.85rem' }}>
                  <HelpCircle size={16} />
                  <span>AI Needs Clarification:</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#fff', margin: '6px 0 10px 0' }}>
                  {clarificationPrompt.question}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {clarificationPrompt.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleClarificationSelect(opt)}
                      className="paw-btn paw-btn-xs paw-btn-primary"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggested Operations (Dynamically computed from dataset columns) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Suggested Operations:
              </span>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(sug)}
                  className="paw-btn paw-btn-xs paw-btn-secondary"
                  style={{ borderRadius: '20px', padding: '6px 12px', fontSize: '0.76rem' }}
                >
                  <Sparkles size={11} style={{ marginRight: '4px' }} className="text-cyan" />
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Visualizer & Power BI Controls */}
          <div className="paw-card" style={{ padding: '24px' }}>
            {/* Visual Header & Manual Controls Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                  {queryResult?.title || 'Visual Output Studio'}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Power BI Aggregation: <strong>{selectedAgg.toUpperCase()}</strong> of{' '}
                  <strong className="text-white">{selectedY || 'Count'}</strong> by{' '}
                  <strong className="text-cyan">{selectedX}</strong>
                </div>
              </div>

              {/* Controls: Chart Type, Metric, Dimension, Aggregation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Dimension (X-Axis) */}
                <select
                  value={selectedX}
                  onChange={(e) => handleManualControlChange(e.target.value, selectedY, selectedAgg, chartType)}
                  className="paw-form-select"
                  style={{ width: 'auto', fontSize: '0.8rem', padding: '6px 10px' }}
                >
                  {profile.categoricalCols.map((c) => (
                    <option key={c.name} value={c.name}>
                      X: {c.name}
                    </option>
                  ))}
                </select>

                {/* Metric (Y-Axis) */}
                <select
                  value={selectedY}
                  onChange={(e) => handleManualControlChange(selectedX, e.target.value, selectedAgg, chartType)}
                  className="paw-form-select"
                  style={{ width: 'auto', fontSize: '0.8rem', padding: '6px 10px' }}
                >
                  <option value="">Y: (Count of Rows)</option>
                  {profile.numericCols.map((c) => (
                    <option key={c.name} value={c.name}>
                      Y: {c.name}
                    </option>
                  ))}
                </select>

                {/* Aggregation */}
                <select
                  value={selectedAgg}
                  onChange={(e) => handleManualControlChange(selectedX, selectedY, e.target.value, chartType)}
                  className="paw-form-select"
                  style={{ width: 'auto', fontSize: '0.8rem', padding: '6px 10px' }}
                >
                  <option value="sum">SUM</option>
                  <option value="avg">AVERAGE</option>
                  <option value="count">COUNT</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                </select>

                {/* Chart Style Switcher */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleManualControlChange(selectedX, selectedY, selectedAgg, 'bar')}
                    className={`paw-btn paw-btn-xs ${chartType === 'bar' ? 'paw-btn-primary' : ''}`}
                    title="Bar Chart"
                  >
                    <BarChart3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualControlChange(selectedX, selectedY, selectedAgg, 'line')}
                    className={`paw-btn paw-btn-xs ${chartType === 'line' ? 'paw-btn-primary' : ''}`}
                    title="Line Chart"
                  >
                    <LineChartIcon size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualControlChange(selectedX, selectedY, selectedAgg, 'area')}
                    className={`paw-btn paw-btn-xs ${chartType === 'area' ? 'paw-btn-primary' : ''}`}
                    title="Area Chart"
                  >
                    <AreaChartIcon size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualControlChange(selectedX, selectedY, selectedAgg, 'pie')}
                    className={`paw-btn paw-btn-xs ${chartType === 'pie' ? 'paw-btn-primary' : ''}`}
                    title="Donut / Pie Chart"
                  >
                    <PieChartIcon size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Canvas */}
            <div style={{ width: '100%', height: '360px', marginTop: '10px' }}>
              {queryResult?.chartData && queryResult.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={queryResult.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  ) : chartType === 'area' ? (
                    <AreaChart data={queryResult.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="value" stroke="#818cf8" fill="rgba(129, 140, 248, 0.25)" />
                    </AreaChart>
                  ) : chartType === 'pie' ? (
                    <PieChart>
                      <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Legend />
                      <Pie
                        data={queryResult.chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={115}
                        paddingAngle={3}
                      >
                        {queryResult.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  ) : (
                    <BarChart data={queryResult.chartData} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {queryResult.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No aggregation formed yet. Select dimensions and metrics above or ask AI.
                </div>
              )}
            </div>

            {/* AI Analytical Findings Commentary */}
            {queryResult?.insight && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Bot size={18} className="text-cyan" />
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                  <strong>AI Insight:</strong> {queryResult.insight}
                </div>
              </div>
            )}
          </div>

          {/* Tabular Data Explorer */}
          <div className="paw-card" style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TableIcon size={18} className="text-emerald" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                  Tabular Data Explorer ({filteredTableData.length.toLocaleString()} Records)
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => {
                      setTableSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search any field..."
                    className="paw-form-input"
                    style={{ paddingLeft: '32px', fontSize: '0.8rem', padding: '6px 12px 6px 32px' }}
                  />
                </div>

                <button onClick={exportCurrentCsv} className="paw-btn paw-btn-xs paw-btn-secondary">
                  <Download size={13} />
                  <span>Download Clean CSV</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="paw-table">
                <thead>
                  <tr>
                    {profile.columns.map((col) => (
                      <th key={col.name}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {col.type === 'numeric' ? '#' : '🗂️'} {col.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {profile.columns.map((col) => (
                        <td key={col.name}>
                          {col.type === 'numeric' && typeof row[col.name] === 'number'
                            ? row[col.name].toLocaleString()
                            : String(row[col.name] ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <div>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
                {Math.min(currentPage * rowsPerPage, filteredTableData.length)} of{' '}
                {filteredTableData.length.toLocaleString()} rows
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="paw-btn paw-btn-xs paw-btn-secondary"
                >
                  Previous
                </button>
                <span style={{ padding: '4px 10px', color: '#fff' }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="paw-btn paw-btn-xs paw-btn-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

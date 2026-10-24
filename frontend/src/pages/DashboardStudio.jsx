import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
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
} from 'lucide-react';

const PALETTE = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8', '#4ade80'];

// Pre-packaged realistic sample datasets for instant 1-click testing
const SAMPLE_DATASETS = {
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
  ecommerce: {
    name: 'Pet_Products_Orders.csv',
    data: [
      { Category: 'Dog Food & Nutrition', Region: 'West India', UnitsSold: 420, GrossSales: 315000, Profit: 78000 },
      { Category: 'Cat Supplements', Region: 'West India', UnitsSold: 280, GrossSales: 168000, Profit: 45000 },
      { Category: 'Anti-Tick & Grooming', Region: 'South India', UnitsSold: 510, GrossSales: 229500, Profit: 68000 },
      { Category: 'Surgical & Ortho Aids', Region: 'North India', UnitsSold: 95, GrossSales: 285000, Profit: 85500 },
      { Category: 'Dog Food & Nutrition', Region: 'South India', UnitsSold: 390, GrossSales: 292500, Profit: 72000 },
      { Category: 'Cat Supplements', Region: 'South India', UnitsSold: 310, GrossSales: 186000, Profit: 52000 },
      { Category: 'Toys & Behavioral', Region: 'West India', UnitsSold: 640, GrossSales: 160000, Profit: 48000 },
      { Category: 'Vaccines & Cold Chain', Region: 'North India', UnitsSold: 180, GrossSales: 360000, Profit: 108000 },
    ],
  },
};

export default function DashboardStudio() {
  const [fileName, setFileName] = useState('Clinic_Monthly_Revenue_2026.xlsx');
  const [rawRows, setRawRows] = useState(SAMPLE_DATASETS.clinicSales.data);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [availableSheets, setAvailableSheets] = useState([]);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'area', 'pie'
  const [xAxisCol, setXAxisCol] = useState('');
  const [yAxisCol, setYAxisCol] = useState('');
  const [aggMode, setAggMode] = useState('sum'); // 'sum', 'avg', 'count'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const fileInputRef = useRef(null);

  // Column inspection
  const columns = useMemo(() => {
    if (!rawRows || rawRows.length === 0) return [];
    return Object.keys(rawRows[0]);
  }, [rawRows]);

  const columnTypes = useMemo(() => {
    const types = {};
    columns.forEach((col) => {
      let isNumeric = true;
      let count = 0;
      for (const row of rawRows) {
        if (row[col] !== null && row[col] !== undefined && row[col] !== '') {
          count++;
          if (typeof row[col] !== 'number' && isNaN(Number(row[col]))) {
            isNumeric = false;
            break;
          }
        }
      }
      types[col] = count > 0 && isNumeric ? 'number' : 'string';
    });
    return types;
  }, [columns, rawRows]);

  const numericCols = useMemo(() => {
    return columns.filter((c) => columnTypes[c] === 'number');
  }, [columns, columnTypes]);

  const categoricalCols = useMemo(() => {
    return columns.filter((c) => columnTypes[c] !== 'number');
  }, [columns, columnTypes]);

  // Default axes on first load or file change
  useMemo(() => {
    if (columns.length > 0) {
      if (!xAxisCol || !columns.includes(xAxisCol)) {
        setXAxisCol(categoricalCols[0] || columns[0]);
      }
      if (!yAxisCol || !columns.includes(yAxisCol)) {
        setYAxisCol(numericCols[0] || columns[1] || columns[0]);
      }
    }
  }, [columns, numericCols, categoricalCols, xAxisCol, yAxisCol]);

  // Handle uploaded Excel / CSV File
  const handleFileUpload = (file) => {
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        setAvailableSheets(sheetNames);
        const firstSheet = sheetNames[0];
        setSelectedSheet(firstSheet);
        const worksheet = workbook.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        if (json && json.length > 0) {
          setRawRows(json);
          setCurrentPage(1);
        }
      } catch (err) {
        alert('Could not parse file. Please upload a valid CSV or XLSX file.');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Instant calculated KPIs
  const kpiStats = useMemo(() => {
    const totalRows = rawRows.length;
    if (totalRows === 0) return { totalRows: 0, metric1: null, metric2: null };

    const m1 = numericCols[0] || null;
    const m2 = numericCols[1] || null;

    const calcSum = (col) =>
      rawRows.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);

    return {
      totalRows,
      metric1: m1
        ? {
            label: m1,
            sum: Math.round(calcSum(m1)),
            avg: Math.round((calcSum(m1) / totalRows) * 10) / 10,
          }
        : null,
      metric2: m2
        ? {
            label: m2,
            sum: Math.round(calcSum(m2)),
            avg: Math.round((calcSum(m2) / totalRows) * 10) / 10,
          }
        : null,
    };
  }, [rawRows, numericCols]);

  // Aggregated data for Recharts
  const chartData = useMemo(() => {
    if (!xAxisCol || !rawRows || rawRows.length === 0) return [];

    const grouped = {};
    rawRows.forEach((r) => {
      const key = String(r[xAxisCol] || '(Blank)');
      const val = Number(r[yAxisCol]) || 0;

      if (!grouped[key]) {
        grouped[key] = { key, sum: 0, count: 0 };
      }
      grouped[key].sum += val;
      grouped[key].count += 1;
    });

    return Object.values(grouped).map((item) => {
      let finalVal = item.sum;
      if (aggMode === 'avg') finalVal = Math.round((item.sum / item.count) * 10) / 10;
      if (aggMode === 'count') finalVal = item.count;
      return {
        name: item.key,
        value: finalVal,
      };
    });
  }, [rawRows, xAxisCol, yAxisCol, aggMode]);

  // Filtered rows for the Data Table
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rawRows;
    const q = searchQuery.toLowerCase();
    return rawRows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [rawRows, searchQuery]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, currentPage]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;

  const exportFilteredCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Filtered_Data');
    XLSX.writeFile(wb, `DataPulse_Export_${Date.now()}.csv`);
  };

  return (
    <div className="paw-page-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner & Workspace Context */}
      <div
        className="paw-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(34, 211, 238, 0.08) 100%)',
          borderColor: 'rgba(129, 140, 248, 0.25)',
          marginBottom: '24px',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="paw-badge badge-indigo">
                <Sparkles size={12} style={{ marginRight: '4px' }} />
                DataPulse Studio
              </span>
              <span className="paw-badge badge-cyan">Universal Auto-Dashboard Engine</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Make Dashboard From Any CSV & Excel File
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', margin: 0 }}>
              Upload any raw spreadsheet to generate instant executive KPIs, interactive charts, and filtered datasets.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/dashboard"
              className="paw-btn paw-btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <Building2 size={16} />
              <span>Switch to Clinic Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* File Upload Zone & Quick Sample Loaders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Upload Box */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="paw-card"
          style={{
            border: '2px dashed rgba(129, 140, 248, 0.4)',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '32px 20px',
            transition: 'all 0.2s ease',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files[0])}
            accept=".csv, .xlsx, .xls"
            style={{ display: 'none' }}
          />
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(129, 140, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#818cf8',
            }}
          >
            <UploadCloud size={28} />
          </div>
          <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 4px 0' }}>
            Drop any CSV or Excel (.xlsx) file here
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            or click to browse from your computer. Automatic schema & metric discovery.
          </p>
          <div style={{ marginTop: '12px' }}>
            <span className="paw-badge badge-emerald" style={{ fontSize: '0.75rem' }}>
              Active File: {fileName} ({rawRows.length} rows)
            </span>
          </div>
        </div>

        {/* Quick Sample Selector Card */}
        <div className="paw-card" style={{ padding: '24px' }}>
          <h4 style={{ color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FileSpreadsheet size={16} className="text-cyan" />
            <span>Don't have a spreadsheet right now? Load a Demo:</span>
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Test the instant chart generator with pre-built real-world datasets:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => {
                setFileName(SAMPLE_DATASETS.clinicSales.name);
                setRawRows(SAMPLE_DATASETS.clinicSales.data);
                setCurrentPage(1);
              }}
              className="paw-btn paw-btn-secondary"
              style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🏥</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>Clinic Revenue & Bookings</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Month, Clinic, Service, Bookings, Revenue, Rating</div>
                </div>
              </div>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                setFileName(SAMPLE_DATASETS.ecommerce.name);
                setRawRows(SAMPLE_DATASETS.ecommerce.data);
                setCurrentPage(1);
              }}
              className="paw-btn paw-btn-secondary"
              style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📦</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>Pet Products Sales & Orders</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category, Region, UnitsSold, GrossSales, Profit</div>
                </div>
              </div>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Instant Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="paw-card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>TOTAL ROWS</span>
            <Hash size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
            {kpiStats.totalRows.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {columns.length} columns detected
          </div>
        </div>

        {kpiStats.metric1 && (
          <div className="paw-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#818cf8', fontSize: '0.8rem' }}>
              <span>TOTAL {kpiStats.metric1.label.toUpperCase()}</span>
              <TrendingUp size={16} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
              {kpiStats.metric1.sum.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Avg: {kpiStats.metric1.avg.toLocaleString()} per record
            </div>
          </div>
        )}

        {kpiStats.metric2 && (
          <div className="paw-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22d3ee', fontSize: '0.8rem' }}>
              <span>TOTAL {kpiStats.metric2.label.toUpperCase()}</span>
              <TrendingUp size={16} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
              {kpiStats.metric2.sum.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Avg: {kpiStats.metric2.avg.toLocaleString()} per record
            </div>
          </div>
        )}

        <div className="paw-card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontSize: '0.8rem' }}>
            <span>DATA DIMENSIONS</span>
            <Layers size={16} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
            {categoricalCols.length} Categories
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {numericCols.length} Numeric metrics ready to plot
          </div>
        </div>
      </div>

      {/* Interactive Chart Generator Section */}
      <div className="paw-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Interactive Chart Studio
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px', margin: 0 }}>
              Plot any dimension against your chosen metric with instant aggregation.
            </p>
          </div>

          {/* Chart Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Chart Type Toggle */}
            <div className="paw-switcher-buttons" style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setChartType('bar')}
                className={`paw-btn paw-btn-xs ${chartType === 'bar' ? 'paw-btn-primary' : 'paw-btn-secondary'}`}
                title="Bar Chart"
              >
                <BarChart3 size={14} />
                <span>Bar</span>
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`paw-btn paw-btn-xs ${chartType === 'line' ? 'paw-btn-primary' : 'paw-btn-secondary'}`}
                title="Line Chart"
              >
                <LineChartIcon size={14} />
                <span>Line</span>
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`paw-btn paw-btn-xs ${chartType === 'area' ? 'paw-btn-primary' : 'paw-btn-secondary'}`}
                title="Area Chart"
              >
                <AreaChartIcon size={14} />
                <span>Area</span>
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`paw-btn paw-btn-xs ${chartType === 'pie' ? 'paw-btn-primary' : 'paw-btn-secondary'}`}
                title="Pie Chart"
              >
                <PieChartIcon size={14} />
                <span>Pie</span>
              </button>
            </div>

            {/* X-Axis Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>X-Axis:</label>
              <select
                value={xAxisCol}
                onChange={(e) => setXAxisCol(e.target.value)}
                className="paw-form-select"
                style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              >
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Y-Axis Metric Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Metric:</label>
              <select
                value={yAxisCol}
                onChange={(e) => setYAxisCol(e.target.value)}
                className="paw-form-select"
                style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              >
                {numericCols.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Aggregation Mode Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Agg:</label>
              <select
                value={aggMode}
                onChange={(e) => setAggMode(e.target.value)}
                className="paw-form-select"
                style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              >
                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count Rows</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Area */}
        <div style={{ height: '380px', width: '100%', marginTop: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="value" name={`${yAxisCol} (${aggMode.toUpperCase()})`} fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={`${yAxisCol} (${aggMode.toUpperCase()})`}
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22d3ee' }}
                />
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name={`${yAxisCol} (${aggMode.toUpperCase()})`}
                  stroke="#34d399"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            ) : (
              <PieChart>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={50}
                  paddingAngle={3}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Data Explorer & Table Section */}
      <div className="paw-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Spreadsheet Data Explorer
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px', margin: 0 }}>
              Showing {filteredRows.length} matching rows. Real-time search across all columns.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search spreadsheet rows..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="paw-form-input"
                style={{ paddingLeft: '32px', height: '34px', fontSize: '0.82rem', width: '220px' }}
              />
            </div>

            <button
              onClick={exportFilteredCSV}
              className="paw-btn paw-btn-secondary paw-btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Grid */}
        <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {columns.map((col) => (
                  <th key={col} style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    }}
                  >
                    {columns.map((col) => (
                      <td key={col} style={{ padding: '10px 14px', color: '#eee' }}>
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No rows matching your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages} ({filteredRows.length} total rows)
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="paw-btn paw-btn-secondary paw-btn-xs"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="paw-btn paw-btn-secondary paw-btn-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

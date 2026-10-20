import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  FileCheck,
  RotateCcw,
  UserX,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle2,
  Stethoscope,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { DashboardService } from '../services/api';

const COLORS = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('30D');
  const [kpis, setKpis] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [species, setSpecies] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [rxTrends, setRxTrends] = useState([]);
  const [vets, setVets] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mostSold, setMostSold] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiRes, dailyRes, svcRes, spcRes, refRes, rxRes, vetRes, clnRes, locRes, soldRes] =
          await Promise.all([
            DashboardService.getKpiSummary(),
            DashboardService.getDailyConsultations(),
            DashboardService.getServiceTypeDistribution(),
            DashboardService.getSpeciesMix(),
            DashboardService.getReferralTatByClinic(),
            DashboardService.getRxComplianceTrends(),
            DashboardService.getTopPerformingVets(),
            DashboardService.getBestPerformingClinics(),
            DashboardService.getPetParentsByLocation(),
            DashboardService.getMostSoldServices(),
          ]);

        setKpis(kpiRes);
        setDailyData(dailyRes);
        setServiceTypes(svcRes);
        setSpecies(spcRes);
        setReferrals(refRes);
        setRxTrends(rxRes);
        setVets(vetRes);
        setClinics(clnRes);
        setLocations(locRes);
        setMostSold(soldRes);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeRange]);

  const handleExportCSV = () => {
    const headers = 'Metric,Value\n';
    const rows = [
      `Consultations (30d),${kpis?.consultations30d || 1842}`,
      `Avg Referral TAT (Hours),${kpis?.avgReferralTatHours || 3.1}`,
      `Rx Compliance %,${kpis?.rxCompliancePct || 78}%`,
      `Repeat Visit Rate %,${kpis?.repeatVisitRate || 34}%`,
      `No-Show Rate %,${kpis?.noShowRate || 9.2}%`,
      `Revenue (30d),INR ${kpis?.revenue30d || 640000}`,
    ].join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PawPulse_Operations_Summary_${Date.now()}.csv`;
    a.click();
  };

  if (loading || !kpis) {
    return (
      <div className="paw-loading-screen">
        <div className="paw-loading-spinner"></div>
        <p>Synthesizing Clinical Operations Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="paw-page-container">
      {/* Page Header */}
      <div className="paw-page-header">
        <div>
          <div className="paw-page-tag">
            <Sparkles size={12} className="text-accent" />
            Executive Operations Cockpit
          </div>
          <h2 className="paw-page-title">Clinic Performance & SLA Intelligence</h2>
          <p className="paw-page-desc">
            Aggregated metrics across network clinics, teleconsultations, and specialist referrals.
          </p>
        </div>

        <div className="paw-header-actions">
          {/* Time Filter */}
          <div className="paw-time-filter">
            {['7D', '30D', '90D', 'YTD'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`paw-filter-btn ${timeRange === range ? 'active' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>

          <button onClick={handleExportCSV} className="paw-btn paw-btn-secondary">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="paw-kpi-grid">
        {/* KPI 1: Consultations */}
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Consultations (30d)</span>
            <div className="paw-kpi-icon indigo">
              <Calendar size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">{kpis.consultations30d.toLocaleString()}</div>
          <div className="paw-kpi-bottom">
            <span className="paw-trend positive">
              <TrendingUp size={14} /> +{kpis.consultationsChange}%
            </span>
            <span className="paw-kpi-sub">vs previous 30 days</span>
          </div>
        </div>

        {/* KPI 2: Avg Referral TAT */}
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Avg Referral TAT</span>
            <div className="paw-kpi-icon amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">
            {kpis.avgReferralTatHours} <span className="paw-unit">hours</span>
          </div>
          <div className="paw-kpi-bottom">
            <span className="paw-target-indicator target-met">
              <CheckCircle2 size={13} /> SLA Target: &lt;4.0 hrs
            </span>
            <span className="paw-kpi-sub">0.9h under SLA limit</span>
          </div>
        </div>

        {/* KPI 3: Rx Compliance */}
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Rx Upload Compliance</span>
            <div className="paw-kpi-icon cyan">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">
            {kpis.rxCompliancePct}%
          </div>
          <div className="paw-kpi-bottom">
            <span className="paw-target-indicator target-breach">
              <AlertTriangle size={13} /> Target: 90%
            </span>
            <span className="paw-kpi-sub">12% gap to protocol</span>
          </div>
        </div>

        {/* KPI 4: Repeat Visit Rate */}
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Repeat Visit Rate</span>
            <div className="paw-kpi-icon emerald">
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">{kpis.repeatVisitRate}%</div>
          <div className="paw-kpi-bottom">
            <span className="paw-trend positive">
              <TrendingUp size={14} /> +{kpis.repeatVisitChange}%
            </span>
            <span className="paw-kpi-sub">90-day retention</span>
          </div>
        </div>

        {/* KPI 5: No-Show Rate */}
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">No-Show Rate</span>
            <div className="paw-kpi-icon rose">
              <UserX size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">{kpis.noShowRate}%</div>
          <div className="paw-kpi-bottom">
            <span className="paw-trend positive">
              <TrendingDown size={14} /> {kpis.noShowChange}%
            </span>
            <span className="paw-kpi-sub">Improvement in attendance</span>
          </div>
        </div>

        {/* KPI 6: 30D Revenue */}
        <div className="paw-kpi-card">
          <div className="paw-kpi-top">
            <span className="paw-kpi-label">Revenue (30d)</span>
            <div className="paw-kpi-icon violet">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="paw-kpi-value">
            ₹{(kpis.revenue30d / 100000).toFixed(1)} <span className="paw-unit">Lakh</span>
          </div>
          <div className="paw-kpi-bottom">
            <span className="paw-trend positive">
              <TrendingUp size={14} /> +{kpis.revenueChange}%
            </span>
            <span className="paw-kpi-sub">Avg ₹347/consult</span>
          </div>
        </div>
      </div>

      {/* Row 1: Daily Consultations & By Service Type */}
      <div className="paw-charts-grid-2">
        {/* Daily Consultations Time Series */}
        <div className="paw-card paw-chart-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Daily Consultations Trend</h3>
              <p className="paw-card-subtitle">30-day volume with 7-day smoothed moving average</p>
            </div>
            <span className="paw-badge badge-indigo">Daily Activity</span>
          </div>
          <div className="paw-chart-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
                <YAxis stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f0f0f5',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Daily Count"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#818cf8' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  name="7-Day Moving Avg"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Service Type */}
        <div className="paw-card paw-chart-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Consultations by Service Type</h3>
              <p className="paw-card-subtitle">Distribution across channels</p>
            </div>
            <span className="paw-badge badge-cyan">Channels</span>
          </div>
          <div className="paw-chart-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceTypes}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis type="number" stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#6b6b80"
                  tick={{ fill: '#f0f0f5', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f0f0f5',
                  }}
                />
                <Bar dataKey="value" name="Consultations" radius={[0, 6, 6, 0]}>
                  {serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Species Mix & Referral TAT by Clinic */}
      <div className="paw-charts-grid-2">
        {/* Species Mix */}
        <div className="paw-card paw-chart-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Patient Species Mix %</h3>
              <p className="paw-card-subtitle">
                Total 3,245 Registered Pets ({kpis.totalDogs} Dogs, {kpis.totalCats} Cats)
              </p>
            </div>
            <span className="paw-badge badge-emerald">Demographics</span>
          </div>
          <div className="paw-chart-body" style={{ height: '280px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={species}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {species.map((entry, index) => (
                      <Cell key={`sp-cell-${index}`} fill={entry.fill || COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `${val}%`}
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#f0f0f5',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="paw-species-legend">
              {species.map((sp, idx) => (
                <div key={idx} className="paw-species-item">
                  <div className="paw-species-dot" style={{ backgroundColor: sp.fill }} />
                  <div className="paw-species-info">
                    <span className="paw-species-name">{sp.name}</span>
                    <span className="paw-species-count">{sp.count} pets ({sp.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Referral TAT by Clinic (with SLA breach line) */}
        <div className="paw-card paw-chart-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Referral Turnaround Time (TAT)</h3>
              <p className="paw-card-subtitle">
                SLA Threshold: 4.0 Hours. Red indicates SLA breach.
              </p>
            </div>
            <span className="paw-badge badge-amber">SLA Monitor</span>
          </div>
          <div className="paw-chart-body" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referrals} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="clinic" stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
                <YAxis stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} unit="h" />
                <Tooltip
                  formatter={(val) => `${val} hours`}
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f0f0f5',
                  }}
                />
                <ReferenceLine
                  y={4.0}
                  stroke="#fb7185"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: '4.0h SLA Limit',
                    fill: '#fb7185',
                    fontSize: 11,
                    position: 'top',
                  }}
                />
                <Bar dataKey="tat" name="Avg TAT (Hours)" radius={[6, 6, 0, 0]}>
                  {referrals.map((entry, index) => (
                    <Cell
                      key={`tat-${index}`}
                      fill={entry.tat > 4.0 ? '#fb7185' : '#34d399'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Rx Compliance Trend & Location breakdown */}
      <div className="paw-charts-grid-2">
        {/* Rx Compliance Weekly Trend */}
        <div className="paw-card paw-chart-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Rx Upload Compliance Trend</h3>
              <p className="paw-card-subtitle">Target: 90% compliance protocol</p>
            </div>
            <span className="paw-badge badge-cyan">Quality Assurance</span>
          </div>
          <div className="paw-chart-body" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rxTrends} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="week" stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(val) => `${val}%`}
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f0f0f5',
                  }}
                />
                <ReferenceLine
                  y={90}
                  stroke="#34d399"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: '90% Protocol Target',
                    fill: '#34d399',
                    fontSize: 11,
                    position: 'top',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  name="Compliance %"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pet Parents by City */}
        <div className="paw-card paw-chart-card">
          <div className="paw-card-header">
            <div>
              <h3 className="paw-card-title">Pet Parents by Geography</h3>
              <p className="paw-card-subtitle">Active client distribution by city</p>
            </div>
            <span className="paw-badge badge-violet">Geography</span>
          </div>
          <div className="paw-chart-body" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locations.slice(0, 6)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis type="number" stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="city"
                  stroke="#6b6b80"
                  tick={{ fill: '#f0f0f5', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f0f0f5',
                  }}
                />
                <Bar dataKey="count" name="Pet Parents" fill="#a78bfa" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3.5: Most Sold Clinical Services */}
      <div className="paw-card paw-chart-card mb-6">
        <div className="paw-card-header">
          <div>
            <h3 className="paw-card-title">Most Sold Services & Treatments</h3>
            <p className="paw-card-subtitle">Volume ranking across clinical and surgical procedures</p>
          </div>
          <span className="paw-badge badge-emerald">Service Mix</span>
        </div>
        <div className="paw-chart-body" style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mostSold} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="name" stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
              <YAxis stroke="#6b6b80" tick={{ fill: '#a0a0b8', fontSize: 11 }} />
              <Tooltip
                formatter={(val, name) => [val, name === 'count' ? 'Procedures' : 'INR']}
                contentStyle={{
                  backgroundColor: '#12121a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#f0f0f5',
                }}
              />
              <Bar dataKey="count" name="Procedures" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Operational Leaderboards */}
      <div className="paw-charts-grid-2">
        {/* Top Performing Vets Table */}
        <div className="paw-card paw-table-card">
          <div className="paw-card-header">
            <div className="flex-row items-center gap-2">
              <Stethoscope size={18} className="text-accent" />
              <div>
                <h3 className="paw-card-title">Top Performing Veterinarians</h3>
                <p className="paw-card-subtitle">Ranked by consultation volume and rating</p>
              </div>
            </div>
            <span className="paw-badge badge-emerald">Medical Staff</span>
          </div>
          <div className="paw-table-responsive">
            <table className="paw-table">
              <thead>
                <tr>
                  <th>Veterinarian</th>
                  <th>Specialization</th>
                  <th>Clinic</th>
                  <th className="text-right">Consults</th>
                  <th className="text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {vets.slice(0, 5).map((v, i) => (
                  <tr key={i}>
                    <td className="font-medium text-white">{v.name}</td>
                    <td>
                      <span className="paw-pill-subtle">{v.specialization}</span>
                    </td>
                    <td className="text-muted">{v.clinic}</td>
                    <td className="text-right font-semibold text-accent">{v.consults}</td>
                    <td className="text-right">
                      <span className="paw-rating-badge">★ {v.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Performing Clinics */}
        <div className="paw-card paw-table-card">
          <div className="paw-card-header">
            <div className="flex-row items-center gap-2">
              <Building2 size={18} className="text-cyan" />
              <div>
                <h3 className="paw-card-title">Best Performing Clinics</h3>
                <p className="paw-card-subtitle">Ranked by monthly revenue and volume</p>
              </div>
            </div>
            <span className="paw-badge badge-indigo">Facilities</span>
          </div>
          <div className="paw-table-responsive">
            <table className="paw-table">
              <thead>
                <tr>
                  <th>Clinic Name</th>
                  <th>City</th>
                  <th className="text-right">Consults</th>
                  <th className="text-right">Revenue (INR)</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((c, i) => (
                  <tr key={i}>
                    <td className="font-medium text-white">{c.name}</td>
                    <td>
                      <span className="flex-row items-center gap-1 text-muted">
                        <MapPin size={12} /> {c.city}
                      </span>
                    </td>
                    <td className="text-right font-semibold">{c.consults}</td>
                    <td className="text-right font-semibold text-emerald">
                      ₹{c.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

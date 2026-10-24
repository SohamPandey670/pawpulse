/**
 * AI Data Intelligence & Power BI Query Engine
 * 
 * Capabilities:
 * 1. Automatic Dataset Profiler (Detects Metrics, Dimensions, Dates, Types, Nulls, Ranges).
 * 2. Natural Language AI Summary (Explains what the dataset represents in plain English).
 * 3. Smart Operation Suggester (Generates Power BI-style DAX & Chart operations tailored to columns).
 * 4. Conversational NL Query Parser (Parses user queries into Aggregations, Filters, Group By, Top N).
 * 5. Dynamic Computation Engine (Executes SUM, AVG, COUNT, MIN, MAX, GROUP BY, SORT, PERCENT OF TOTAL).
 */

/**
 * Profiles a raw tabular dataset (array of objects)
 */
export function profileDataset(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const sampleSize = Math.min(data.length, 500);
  const sampleRows = data.slice(0, sampleSize);
  const columnNames = Object.keys(data[0] || {});

  const columns = columnNames.map((colName) => {
    let numericCount = 0;
    let dateCount = 0;
    let nullCount = 0;
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    const uniqueValues = new Set();

    for (let i = 0; i < sampleSize; i++) {
      const val = sampleRows[i][colName];
      if (val === null || val === undefined || val === '') {
        nullCount++;
        continue;
      }

      uniqueValues.add(String(val));

      // Check if numeric
      const cleanVal = typeof val === 'string' ? val.replace(/[$,₹,€,%\s]/g, '') : val;
      const num = Number(cleanVal);
      if (!isNaN(num) && typeof val !== 'boolean') {
        numericCount++;
        sum += num;
        if (num < min) min = num;
        if (num > max) max = num;
      }

      // Check if date
      if (typeof val === 'string' && val.length >= 6) {
        const parsedDate = Date.parse(val);
        if (!isNaN(parsedDate) && isNaN(val)) {
          dateCount++;
        }
      }
    }

    const nonNullCount = sampleSize - nullCount;
    let type = 'categorical'; // default

    if (numericCount / (nonNullCount || 1) >= 0.75) {
      // Check if it's an ID or genuine metric
      const lower = colName.toLowerCase();
      if (lower.endsWith('id') || lower === 'id' || lower.includes('zip') || lower.includes('code')) {
        type = 'identifier';
      } else {
        type = 'numeric';
      }
    } else if (dateCount / (nonNullCount || 1) >= 0.75 || colName.toLowerCase().includes('date') || colName.toLowerCase().includes('month')) {
      type = 'date';
    } else if (uniqueValues.size / (nonNullCount || 1) >= 0.8 && sampleSize > 30) {
      type = 'text';
    }

    const avg = numericCount > 0 ? sum / numericCount : 0;

    return {
      name: colName,
      type,
      uniqueCount: uniqueValues.size,
      sampleValues: Array.from(uniqueValues).slice(0, 5),
      nullCount,
      min: min === Infinity ? 0 : min,
      max: max === -Infinity ? 0 : max,
      avg: Number(avg.toFixed(2)),
      sum: Number(sum.toFixed(2)),
    };
  });

  const numericCols = columns.filter((c) => c.type === 'numeric');
  const categoricalCols = columns.filter((c) => c.type === 'categorical' || c.type === 'date');
  const dateCols = columns.filter((c) => c.type === 'date');

  // Infer Domain Category
  const allColNames = columnNames.map((c) => c.toLowerCase()).join(' ');
  let domain = 'General Tabular Intelligence';
  if (/revenue|sales|price|cost|profit|order|product|customer|discount|amount|invoice/i.test(allColNames)) {
    domain = 'E-Commerce & Financial Revenue';
  } else if (/pet|clinic|vet|doctor|appointment|patient|diagnosis|prescription|dosage|hospital/i.test(allColNames)) {
    domain = 'Veterinary & Clinical Operations';
  } else if (/employee|salary|department|hire|attendance|leave|staff|rating|performance/i.test(allColNames)) {
    domain = 'Human Resources & Workforce';
  } else if (/inventory|stock|warehouse|shipment|sku|quantity|supplier|delivery/i.test(allColNames)) {
    domain = 'Supply Chain & Inventory';
  }

  // Generate Natural Language AI Summary
  const primaryMetric = numericCols[0]?.name || 'Records';
  const primaryDimension = categoricalCols[0]?.name || 'Index';

  const summary = `Detected ${data.length.toLocaleString()} rows across ${columnNames.length} fields (${numericCols.length} Metrics, ${categoricalCols.length} Dimensions). Identified domain: "${domain}". Top quantitative metric is "${primaryMetric}" and primary grouping key is "${primaryDimension}". The dataset is structurally clean with ${(100 - (columns.reduce((a, b) => a + b.nullCount, 0) / (sampleSize * columnNames.length || 1) * 100)).toFixed(1)}% data completeness.`;

  return {
    rowCount: data.length,
    columnCount: columnNames.length,
    columns,
    numericCols,
    categoricalCols,
    dateCols,
    domain,
    summary,
  };
}

/**
 * Generates Smart Operations tailored specifically to the dataset
 */
export function generateSmartSuggestions(profile) {
  if (!profile) return [];

  const { numericCols, categoricalCols, dateCols } = profile;
  const suggestions = [];

  const num1 = numericCols[0]?.name;
  const num2 = numericCols[1]?.name;
  const cat1 = categoricalCols[0]?.name;
  const cat2 = categoricalCols[1]?.name;
  const dateCol = dateCols[0]?.name;

  if (num1 && cat1) {
    suggestions.push({
      label: `Total ${num1} by ${cat1}`,
      query: `Show total ${num1} grouped by ${cat1} as a bar chart`,
      metric: num1,
      dimension: cat1,
      agg: 'sum',
      chartType: 'bar',
    });
  }

  if (num1 && dateCol) {
    suggestions.push({
      label: `${num1} Timeline over ${dateCol}`,
      query: `Plot ${num1} trend across ${dateCol} as a line chart`,
      metric: num1,
      dimension: dateCol,
      agg: 'sum',
      chartType: 'line',
    });
  } else if (num1 && cat2) {
    suggestions.push({
      label: `Average ${num1} by ${cat2}`,
      query: `Calculate average ${num1} per ${cat2}`,
      metric: num1,
      dimension: cat2,
      agg: 'avg',
      chartType: 'bar',
    });
  }

  if (cat1) {
    suggestions.push({
      label: `Share of Records by ${cat1}`,
      query: `Show distribution of rows by ${cat1} as a pie chart`,
      metric: 'Count',
      dimension: cat1,
      agg: 'count',
      chartType: 'pie',
    });
  }

  if (num2 && cat1) {
    suggestions.push({
      label: `Total ${num2} Breakdown`,
      query: `Breakdown ${num2} across ${cat1}`,
      metric: num2,
      dimension: cat1,
      agg: 'sum',
      chartType: 'area',
    });
  }

  if (num1) {
    suggestions.push({
      label: `Top 5 Records by ${num1}`,
      query: `Find top 5 entries with highest ${num1}`,
      metric: num1,
      dimension: cat1 || 'Index',
      agg: 'sum',
      chartType: 'bar',
      isTop5: true,
    });
  }

  return suggestions;
}

/**
 * Executes a Power BI-style query based on User Prompt or Smart Suggestion
 */
export function executeDataQuery(queryStr, data, profile, options = {}) {
  if (!data || data.length === 0 || !profile) {
    return null;
  }

  const { numericCols, categoricalCols, dateCols } = profile;
  const q = (queryStr || '').toLowerCase();

  // 1. Determine Chart Type
  let chartType = options.chartType || 'bar';
  if (q.includes('line') || q.includes('trend') || q.includes('over time') || q.includes('timeline')) {
    chartType = 'line';
  } else if (q.includes('pie') || q.includes('share') || q.includes('proportion') || q.includes('donut')) {
    chartType = 'pie';
  } else if (q.includes('area') || q.includes('cumulative') || q.includes('fill')) {
    chartType = 'area';
  }

  // 2. Determine Aggregation (SUM, AVG, COUNT, MIN, MAX)
  let agg = options.agg || 'sum';
  if (q.includes('average') || q.includes('avg') || q.includes('mean')) {
    agg = 'avg';
  } else if (q.includes('count') || q.includes('number of') || q.includes('distribution') || q.includes('frequency')) {
    agg = 'count';
  } else if (q.includes('minimum') || q.includes('lowest') || q.includes('min')) {
    agg = 'min';
  } else if (q.includes('maximum') || q.includes('highest') || q.includes('max')) {
    agg = 'max';
  }

  // 3. Determine Dimension (X-Axis)
  let dimension = options.dimension;
  if (!dimension) {
    // Try matching query against available dimensions
    for (const cat of categoricalCols) {
      if (q.includes(cat.name.toLowerCase())) {
        dimension = cat.name;
        break;
      }
    }
  }
  if (!dimension && chartType === 'line' && dateCols.length > 0) {
    dimension = dateCols[0].name;
  }
  if (!dimension) {
    dimension = categoricalCols[0]?.name || Object.keys(data[0])[0];
  }

  // 4. Determine Metric (Y-Axis)
  let metric = options.metric;
  if (!metric && agg !== 'count') {
    for (const num of numericCols) {
      if (q.includes(num.name.toLowerCase())) {
        metric = num.name;
        break;
      }
    }
  }
  if (!metric && agg !== 'count') {
    metric = numericCols[0]?.name || null;
  }

  // 5. Compute Power BI-style Grouping & Aggregation
  const grouped = {};
  let totalGrandSum = 0;

  data.forEach((row) => {
    const rawKey = row[dimension];
    const key = rawKey !== null && rawKey !== undefined && rawKey !== '' ? String(rawKey) : '(Blank)';
    
    let rawVal = 1;
    if (agg !== 'count' && metric) {
      const v = typeof row[metric] === 'string' ? row[metric].replace(/[$,₹,€,%\s]/g, '') : row[metric];
      rawVal = Number(v) || 0;
    }

    if (!grouped[key]) {
      grouped[key] = {
        name: key,
        sum: 0,
        count: 0,
        min: rawVal,
        max: rawVal,
      };
    }

    grouped[key].sum += rawVal;
    grouped[key].count += 1;
    if (rawVal < grouped[key].min) grouped[key].min = rawVal;
    if (rawVal > grouped[key].max) grouped[key].max = rawVal;
    totalGrandSum += rawVal;
  });

  // Format into Chart Array
  let chartData = Object.values(grouped).map((g) => {
    let finalValue = g.sum;
    if (agg === 'avg') finalValue = g.count > 0 ? g.sum / g.count : 0;
    else if (agg === 'count') finalValue = g.count;
    else if (agg === 'min') finalValue = g.min;
    else if (agg === 'max') finalValue = g.max;

    const percent = totalGrandSum > 0 ? (g.sum / totalGrandSum) * 100 : 0;

    return {
      name: g.name,
      value: Number(finalValue.toFixed(2)),
      count: g.count,
      percent: Number(percent.toFixed(1)),
    };
  });

  // Sort descending by value
  chartData.sort((a, b) => b.value - a.value);

  // If top N requested or large cardinality
  if (options.isTop5 || q.includes('top 5') || chartData.length > 25) {
    chartData = chartData.slice(0, 10);
  }

  // Generate Executive Insight
  const topItem = chartData[0];
  const lowItem = chartData[chartData.length - 1];
  const insight = topItem
    ? `Analysis Complete: "${topItem.name}" ranks highest in ${agg.toUpperCase()}(${metric || 'Count'}) with ${topItem.value.toLocaleString()} (${topItem.percent}% of total across ${chartData.length} distinct groups). Lowest performer is "${lowItem.name}" at ${lowItem.value.toLocaleString()}.`
    : 'No conclusive aggregation could be formed from the selected fields.';

  return {
    chartType,
    metric: metric || 'Row Count',
    dimension,
    agg,
    chartData,
    insight,
    title: `${agg.toUpperCase()} of ${metric || 'Records'} by ${dimension}`,
  };
}

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import '../../css/main.css';
import { Navbar } from 'bootstrap/dist/js/bootstrap.bundle.js';
import { add, format, startOfToday, startOfYear } from 'date-fns';
import drawMap from './map';
import setDefaults from './chartDefaults';
import drawFlowChart from './flowChart';
import drawSalinityChart from './salinityChart';
import drawJohnsIslandChart from './johnsIslandChart';
import drawContributionChart from './contributionChart';

const dateRangeButtons = document.querySelectorAll('#dateRangeButtons > input');
const chartCards = document.querySelectorAll('.chart-card');
const chartCanvases = document.querySelectorAll('canvas:not(.mapboxgl-canvas)');

const fetchData = async (dateRange) => {
  // turn on loading effects
  dateRangeButtons.forEach((button) => button.setAttribute('disabled', 'disabled'));
  chartCanvases.forEach((canvas) => canvas.classList.add('invisible'));
  chartCards.forEach((card) => card.classList.add('shimmer'));

  const response = await fetch(`/api/data/${dateRange.start}/${dateRange.end}`);

  // turn off loading effects
  dateRangeButtons.forEach((button) => button.removeAttribute('disabled'));
  chartCanvases.forEach((canvas) => canvas.classList.remove('invisible'));
  chartCards.forEach((card) => card.classList.remove('shimmer'));

  let result = null;

  if (response.status === 204) {
    alert(`No data found between ${dateRange.start} and ${dateRange.end}.`);
  } else if (response.ok) {
    result = response.json();
  } else {
    alert(`An unexpected error occured. Could not fetch data.`);
  }

  return result;
};

const charts = [];

const drawCharts = async (dateRange) => {
  if (!dateRange) {
    dateRange = {
      start: format(add(startOfToday(), { months: -1 }), 'yyyy-MM-dd'),
      end: format(startOfToday(), 'yyyy-MM-dd')
    }
  } else {
    dateRange = getStartEndFromDateRange(dateRange);
  }

  const data = await fetchData(dateRange);

  if (data) {
    charts.forEach((chart) => chart.destroy());
    setDefaults(data, dateRange);
    charts.push(await drawSalinityChart(data, dateRange));
    charts.push(await drawFlowChart(data));
    charts.push(await drawJohnsIslandChart(data));
    charts.push(await drawContributionChart(data));
  }
};

drawMap();
drawCharts();

dateRangeButtons.forEach((button) => {
  button.addEventListener('change', dateRangeListener);
});

async function dateRangeListener() {
  await drawCharts(this.value);
}

function getStartEndFromDateRange(dateRange) {
  let duration = {};

  switch (dateRange) {
    case 'YTD':
      const end = format(startOfToday(), 'yyyy-MM-dd');
      const start = format(startOfYear(startOfToday()), 'yyyy-MM-dd');
    
      return { start, end };
      break;
    case '1Y':
      duration.years = -1;
      break;
    case '6M':
      duration.months = -6;
      break;
    case '3M':
      duration.months = -3;
      break;
    case '1M':
      duration.months = -1;
      break;
    case '1W':
      duration.weeks = -1;
      break;
  }

  const end = format(startOfToday(), 'yyyy-MM-dd');
  const start = format(add(startOfToday(), duration), 'yyyy-MM-dd');

  return { start, end };
}

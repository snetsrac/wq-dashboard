import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { startOfToday } from 'date-fns';
import { enUS } from 'date-fns/locale';

export default function setDefaults(datasets, dateRange) {
  Chart.defaults.interaction = { mode: 'index', intersect: false };
  Chart.defaults.maintainAspectRatio = false;

  Chart.defaults.datasets.line.borderJoinStyle = 'round'
  Chart.defaults.datasets.line.pointRadius = 0;

  Chart.defaults.plugins.title.display = true;
  Chart.defaults.plugins.title.position = 'left',
  Chart.defaults.plugins.title.font.size = 24;
  Chart.defaults.plugins.title.font.weight = 'bold';
  Chart.defaults.plugins.tooltip.callbacks.label = (ctx) => {
    const unit = ctx.dataset.unit.toLowerCase() === 'psu' ? '' : ` ${ctx.dataset.unit}`;
    return ` ${ctx.dataset.label}: ${ctx.formattedValue}${unit}`;
  };

  Chart.defaults.scales.linear.title = { display: true };
  Chart.defaults.scales.linear.ticks.callback = (value) => value.toLocaleString().padStart(5);
  Chart.defaults.scales.linear.ticks.font = { family: 'monospace' };
  Chart.defaults.scales.linear.beginAtZero = true;

  Chart.defaults.scales.time.adapters.date = { locale: enUS };
  Chart.defaults.scales.time.time.unit = 'day';
  Chart.defaults.scales.time.time.displayFormats.day = 'M/d/yy';
  Chart.defaults.scales.time.time.tooltipFormat = 'PPP';
  Chart.defaults.scales.time.suggestedMin = dateRange.start;
  Chart.defaults.scales.time.suggestedMax = dateRange.end;

  Chart.defaults.spanGaps = false;
}

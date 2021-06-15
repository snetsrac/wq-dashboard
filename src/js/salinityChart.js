import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { startOfToday } from 'date-fns';
import colors from './colors';

const SALINITY_ENVELOPE_LOW = 15;
const SALINITY_ENVELOPE_HIGH = 25;

Chart.register( annotationPlugin);

export default async function drawSalinityChart(data, dateRange) {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          ...data[39481],
          label: 'LWL-19',
          borderColor: colors[39481]
        },
        {
          ...data[39485],
          label: 'LWL-20A',
          borderColor: colors[39485]
        },
        {
          ...data['John\'s Island'],
          label: 'John\'s Island',
          borderColor: colors['John\'s Island']
        },
        {
          ...data['Munyon Island'],
          label: 'Munyon Island',
          borderColor: colors['Munyon Island']
        }
      ]
    },
    options: {
      plugins: {
        title: {
          text: 'Salinity Envelope'
        },
        annotation: {
          annotations: {
            salinityEnvelope: {
              drawTime: 'beforeDraw',
              type: 'box',
              xMin: dateRange.start,
              xMax: dateRange.end,
              yMin: SALINITY_ENVELOPE_LOW,
              yMax: SALINITY_ENVELOPE_HIGH,
              backgroundColor: colors['salinityEnvelope'],
              borderWidth: 0
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time'
        },
        y: {
          type: 'linear',
          title: {
            text: 'Daily Average Salinity (PSU)'
          }
        },
        right: {
          type: 'linear',
          position: 'right',
          title: {
            text: ' '
          },
          grid: {
            drawOnChartArea: false,
            tickWidth: 0
          },
          ticks: {
            callback: () => '     '
          }
        }
      }
    }
  };

  const chart = new Chart(
    document.getElementById('salinityChart'),
    config
  );

  return chart;
};


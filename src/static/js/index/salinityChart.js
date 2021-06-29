import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { startOfToday } from 'date-fns';
import styles from './styles';

const SALINITY_ENVELOPE_LOW = 15;
const SALINITY_ENVELOPE_HIGH = 25;

Chart.register( annotationPlugin);

export default async function drawSalinityChart(data, dateRange) {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'LWL-19',
          ...data[39481],
          ...styles[39481]
        },
        {
          label: 'LWL-20A',
          ...data[39485],
          ...styles[39485]
        },
        {
          label: 'John\'s Island',
          ...data['John\'s Island'],
          ...styles['John\'s Island']
        },
        {
          label: 'Munyon Island',
          ...data['Munyon Island'],
          ...styles['Munyon Island']
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
              ...styles['salinityEnvelope']
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


import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { startOfToday } from 'date-fns';
import styles from './styles';

const SALINITY_ENVELOPE_LOW = 15;
const SALINITY_ENVELOPE_HIGH = 20;

Chart.register( annotationPlugin);

const salinityKeys = ['JOHNS', 'LWL20AS+SA', 'LWL19S+SA', 'LWL19B+SA', 'LWL20AB+SA', 'MUNYON', 'LWL20S', 'LWL20B'];

export default async function drawSalinityChart(data, dateRange) {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Munyon Island',
          ...data['MUNYON'],
          ...styles['MUNYON']
        },
        {
          label: 'John\'s Island',
          ...data['JOHNS'],
          ...styles['JOHNS']
        },
        {
          label: 'LWL20 Surface',
          ...data['LWL20S'],
          ...styles['LWL20S']
        },
        {
          label: 'LWL20 Bottom',
          ...data['LWL20B'],
          ...styles['LWL20B']
        },
        {
          label: 'LWL19 Surface',
          ...data['LWL19S+SA'],
          ...styles['LWL19S+SA']
        },
        {
          label: 'LWL19 Bottom',
          ...data['LWL19B+SA'],
          ...styles['LWL19B+SA']
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


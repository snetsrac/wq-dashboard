import Chart from 'chart.js/auto';
import colors from './colors';

export default async function drawFlowChart(data) {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          ...data[91602],
          label: 'S-44 (C-17)',
          borderColor: colors[91602]
        },
        {
          ...data[91404],
          label: 'S-155 (C-51)',
          borderColor: colors[91404]
        },
        {
          ...data[91601],
          label: 'S-41 (C-16)',
          borderColor: colors[91601]
        },
      ]
    },
    options: {
      plugins: {
        title: {
          text: 'Canal Flow'
        }
      },
      scales: {
        x: {
          type: 'time',
        },
        y: {
          type: 'linear',
          title: {
            text: 'Daily Average Flow Rate (cfs)'
          },
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

  return new Chart(
    document.getElementById('flowChart'),
    config
  );
};


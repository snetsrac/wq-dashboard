import Chart from 'chart.js/auto';
import colors from './colors';

export default async function drawJohnsIslandChart(data) {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          ...data['John\'s Island'],
          label: 'Salinity',
          borderColor: colors['John\'s Island'],
          yAxisID: 'ySalinity'
        },
        {
          ...data[91404],
          label: 'Flow',
          borderColor: colors[91404],
          yAxisID: 'yFlow'
        }
      ]
    },
    options: {
      plugins: {
        title: {
          text: 'John\'s Island (C-51)',
        }
      },
      scales: {
        x: {
          type: 'time',
        },
        ySalinity: {
          type: 'linear',
          title: {
            text: 'Daily Average Salinity (PSU)'
          }
        },
        yFlow: {
          type: 'linear',
          position: 'right',
          title: {
            text: 'Daily Average Flow Rate (cfs)'
          },
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            callback: (value) => value.toLocaleString().padEnd(5)
          }
        }
      }
    }
  };

  return new Chart(
    document.getElementById('johnsIslandChart'),
    config
  );
};


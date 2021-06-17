import Chart from 'chart.js/auto';
import styles from './styles';

export default async function drawJohnsIslandChart(data) {
  const config = {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Salinity',
          ...data['John\'s Island'],
          ...styles['John\'s Island'],
          yAxisID: 'ySalinity'
        },
        {
          label: 'Flow',
          ...data[91404],
          ...styles[91404],
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


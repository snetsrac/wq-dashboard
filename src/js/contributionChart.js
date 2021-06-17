import { Chart } from 'chart.js';
import styles from './styles';

export default async function drawContributionChart(data) {
  const grandTotal = data[91602].total + data[91404].total + data[91601].total;
  
  const config = {
    type: 'pie',
    data: {
      labels: ['S-44 (C-17)', 'S-155 (C-51)', 'S-41 (C-16)'],
      datasets: [{
        data: [
          data[91602].total,
          data[91404].total,
          data[91601].total,
        ],
        backgroundColor: [
          styles[91602].borderColor,
          styles[91404].borderColor,
          styles[91601].borderColor
        ]
      }]
    },
    options: {
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      plugins: {
        title: {
          text: 'Relative Input'
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ` +
              `${ctx.raw.toLocaleString('en', { maximumFractionDigits: 0 })} acre-feet` +
              ` (${(ctx.raw / grandTotal).toLocaleString('en', { style: 'percent'})})`
          }
        },
        legend: {
          position: 'right',
          labels: {
            boxHeight: Chart.defaults.font.size,
            boxWidth: Chart.defaults.font.size
          }
        }
      }
    }
  };

  return new Chart(
    document.getElementById('contributionChart'),
    config
  );
};


"use client";
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Chart from '../chartRegister';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ScoresChartProps {
  sectionData: {
    [sectionTitle: string]: number;
  };
}

const ScoresChart: React.FC<ScoresChartProps> = ({ sectionData }) => {
  const [chartData, setChartData] = useState({
    labels: ['Perceivable', 'Operable', 'Understandable', 'Robust'],
    datasets: [
      {
        label: 'XP Earned',
        data: [0, 0, 0, 0],
        backgroundColor: '#C16102',
        borderColor: '#8B4513',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Update chart data when sectionData changes
    const data = [
      sectionData['Perceivable'] || 0,
      sectionData['Operable'] || 0,
      sectionData['Understandable'] || 0,
      sectionData['Robust'] || 0
    ];

    setChartData({
      labels: ['1. Perceivable', '2. Operable', '3. Understandable', '4. Robust'],
      datasets: [
        {
          label: 'XP Earned',
          data,
          backgroundColor: '#C16102',
          borderColor: '#8B4513',
          borderWidth: 1,
        },
      ],
    });
  }, [sectionData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#5B5B5B',
          font: {
            size: 12,
          },
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#5B5B5B',
          font: {
            size: 12,
          },
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#5B5B5B',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  // Check if there's any data to display
  const hasData = chartData.datasets[0].data.some(value => value > 0);

  if (!hasData) {
    return (
      <div className="empty-chart-container">
        <div className="empty-chart-message">
          <p>No XP data to display yet. Complete quizzes to see your scores!</p>
        </div>
        <Bar 
          data={{
            ...chartData,
            datasets: [{ ...chartData.datasets[0], data: [0, 0, 0, 0] }]
          }}
          options={options}
        />
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ScoresChart; 
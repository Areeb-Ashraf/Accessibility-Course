'use client';

import { Chart, registerables } from 'chart.js';

// This prevents Chart.js errors when used with Next.js
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

export default Chart; 
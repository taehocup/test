import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  LineController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { Measurement } from '../types/spring';
import { PHYSICS_CONSTANTS } from '../utils/physics';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  LineController
);

interface ForceGraphProps {
  measurements: Measurement[];
  currentDisplacement: number;
  currentElasticForce: number;
  springConstant: number;
}

export function ForceGraph({
  measurements,
  currentDisplacement,
  currentElasticForce,
  springConstant
}: ForceGraphProps) {
  // 그래프 데이터 준비
  const chartData = useMemo(() => {
    // 측정된 데이터 포인트들
    const measurementPoints = measurements.map(m => ({
      x: m.displacement,
      y: Math.abs(m.elasticForce)
    }));

    // 현재 포인트 (실시간)
    const currentPoint = {
      x: currentDisplacement,
      y: Math.abs(currentElasticForce)
    };

    // 이론적 직선 (훅의 법칙)
    const theoreticalLine = [];
    const minDisplacement = -15; // -15cm부터
    const maxDisplacement = 25;  // 25cm까지
    const steps = 40;

    for (let i = 0; i <= steps; i++) {
      const displacement = minDisplacement + (i * (maxDisplacement - minDisplacement)) / steps;
      const force = Math.abs(springConstant * displacement * PHYSICS_CONSTANTS.CM_TO_M);
      theoreticalLine.push({ x: displacement, y: force });
    }

    return {
      datasets: [
        // 이론적 직선 (훅의 법칙)
        {
          label: `이론값 (F = ${springConstant} × x)`,
          data: theoreticalLine,
          borderColor: '#6b7280',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          type: 'line' as const,
          showLine: true,
          order: 3
        },
        // 측정된 데이터 포인트들
        {
          label: '측정값',
          data: measurementPoints,
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          type: 'scatter' as const,
          order: 2
        },
        // 현재 포인트 (실시간)
        {
          label: '현재값',
          data: [currentPoint],
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 3,
          pointRadius: 8,
          pointHoverRadius: 10,
          type: 'scatter' as const,
          order: 1
        }
      ]
    };
  }, [measurements, currentDisplacement, currentElasticForce, springConstant]);

  // 그래프 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '탄성력 vs 변위 그래프 (F-x Graph)',
        font: {
          size: 18,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const dataset = context.dataset;
            const x = context.parsed.x;
            const y = context.parsed.y;

            if (dataset.label.includes('이론값')) {
              return `${dataset.label}: x=${x.toFixed(1)}cm, F=${y.toFixed(3)}N`;
            } else {
              return `${dataset.label}: x=${x.toFixed(1)}cm, F=${y.toFixed(3)}N`;
            }
          }
        }
      },
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '변위 (cm)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        grid: {
          display: true,
          color: '#f3f4f6'
        },
        min: -15,
        max: 25
      },
      y: {
        title: {
          display: true,
          text: '탄성력 (N)',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
        grid: {
          display: true,
          color: '#f3f4f6'
        },
        min: 0,
        max: Math.max(5, Math.abs(currentElasticForce) * 1.5,
          ...measurements.map(m => Math.abs(m.elasticForce) * 1.2))
      }
    },
    interaction: {
      intersect: false,
      mode: 'point' as const
    },
    animation: {
      duration: 300
    }
  };

  // 통계 정보 계산
  const stats = useMemo(() => {
    if (measurements.length === 0) return null;

    const displacements = measurements.map(m => m.displacement);
    const forces = measurements.map(m => Math.abs(m.elasticForce));

    // 선형 회귀 (최소자승법)
    const n = measurements.length;
    const sumX = displacements.reduce((sum, x) => sum + x, 0);
    const sumY = forces.reduce((sum, y) => sum + y, 0);
    const sumXY = measurements.reduce((sum, m) => sum + m.displacement * Math.abs(m.elasticForce), 0);
    const sumX2 = displacements.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 결정계수 (R²)
    const yMean = sumY / n;
    const ssTot = forces.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssRes = measurements.reduce((sum, m) => {
      const predicted = slope * m.displacement + intercept;
      return sum + Math.pow(Math.abs(m.elasticForce) - predicted, 2);
    }, 0);
    const r2 = 1 - (ssRes / ssTot);

    return {
      slope: slope * PHYSICS_CONSTANTS.M_TO_CM, // N/m 단위로 변환
      intercept,
      r2,
      count: n
    };
  }, [measurements]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">F-x 그래프 분석</h2>
        <div className="text-sm text-gray-600">
          측정점 {measurements.length}개
        </div>
      </div>

      {/* 그래프 */}
      <div className="relative" style={{ height: '400px' }}>
        <Chart type="scatter" data={chartData} options={chartOptions} />
      </div>

      {/* 범례 및 설명 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-gray-500 border-dashed border"></div>
          <span className="text-gray-600">이론값 (훅의 법칙)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">측정값</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">현재값</span>
        </div>
      </div>

      {/* 통계 정보 */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">📊 선형 회귀 분석</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">측정된 기울기</div>
              <div className="font-mono text-lg text-blue-600">
                {stats.slope.toFixed(1)} N/m
              </div>
            </div>
            <div>
              <div className="text-gray-600">이론 기울기</div>
              <div className="font-mono text-lg text-gray-800">
                {springConstant} N/m
              </div>
            </div>
            <div>
              <div className="text-gray-600">오차</div>
              <div className="font-mono text-lg text-red-600">
                {Math.abs(stats.slope - springConstant).toFixed(1)} N/m
              </div>
            </div>
            <div>
              <div className="text-gray-600">결정계수 (R²)</div>
              <div className="font-mono text-lg text-green-600">
                {stats.r2.toFixed(3)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 bg-white p-2 rounded">
            💡 <strong>분석:</strong> 결정계수(R²)가 1에 가까울수록 측정값이 이론값에 잘 맞습니다.
            측정된 기울기는 용수철상수를 나타냅니다.
          </div>
        </div>
      )}

      {/* 교육적 설명 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">📚 그래프 해석 가이드</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>직선 관계:</strong> 탄성 한계 내에서 힘과 변위는 비례관계입니다.</p>
          <p>• <strong>기울기:</strong> 직선의 기울기가 용수철 상수(k)입니다.</p>
          <p>• <strong>원점 통과:</strong> 이론적으로 그래프는 원점(0,0)을 지납니다.</p>
          <p>• <strong>측정 오차:</strong> 실제 측정값은 이론값 주변에 분포합니다.</p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import type { Measurement } from '../types/spring';
import { formatMeasurement } from '../utils/physics';

interface DataTableProps {
  measurements: Measurement[];
  onRemoveMeasurement: (id: string) => void;
  onClearMeasurements: () => void;
  onDownloadCSV: () => void;
}

export function DataTable({
  measurements,
  onRemoveMeasurement,
  onClearMeasurements,
  onDownloadCSV
}: DataTableProps) {
  const [sortField, setSortField] = useState<keyof Measurement>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // 정렬 함수
  const handleSort = (field: keyof Measurement) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 정렬된 측정값들
  const sortedMeasurements = [...measurements].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  // 통계 계산
  const stats = measurements.length > 0 ? {
    avgDisplacement: measurements.reduce((sum, m) => sum + m.displacement, 0) / measurements.length,
    avgElasticForce: measurements.reduce((sum, m) => sum + Math.abs(m.elasticForce), 0) / measurements.length,
    maxDisplacement: Math.max(...measurements.map(m => Math.abs(m.displacement))),
    maxElasticForce: Math.max(...measurements.map(m => Math.abs(m.elasticForce))),
    minDisplacement: Math.min(...measurements.map(m => Math.abs(m.displacement))),
    minElasticForce: Math.min(...measurements.map(m => Math.abs(m.elasticForce)))
  } : null;

  const SortIcon = ({ field }: { field: keyof Measurement }) => {
    if (sortField !== field) return <span className="text-gray-400">↕</span>;
    return sortDirection === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">측정 데이터 표</h2>
        <div className="flex space-x-2">
          <button
            onClick={onDownloadCSV}
            disabled={measurements.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            📥 CSV 다운로드
          </button>
          <button
            onClick={onClearMeasurements}
            disabled={measurements.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            🗑 전체 삭제
          </button>
        </div>
      </div>

      {/* 통계 요약 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-blue-600 font-medium">평균 변위</div>
            <div className="text-lg font-bold text-blue-800">
              {formatMeasurement(Math.abs(stats.avgDisplacement), 'cm')}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-purple-600 font-medium">평균 탄성력</div>
            <div className="text-lg font-bold text-purple-800">
              {formatMeasurement(stats.avgElasticForce, 'N')}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-green-600 font-medium">최대 변위</div>
            <div className="text-lg font-bold text-green-800">
              {formatMeasurement(stats.maxDisplacement, 'cm')}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-red-600 font-medium">최대 탄성력</div>
            <div className="text-lg font-bold text-red-800">
              {formatMeasurement(stats.maxElasticForce, 'N')}
            </div>
          </div>
        </div>
      )}

      {/* 데이터 테이블 */}
      {measurements.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">아직 측정된 데이터가 없습니다.</p>
          <p className="text-sm">용수철을 조작한 후 '측정값 기록' 버튼을 눌러 데이터를 기록하세요.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>측정시간</span>
                    <SortIcon field="timestamp" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('naturalLength')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>자연길이 (cm)</span>
                    <SortIcon field="naturalLength" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('currentLength')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>현재길이 (cm)</span>
                    <SortIcon field="currentLength" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('displacement')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>변위 (cm)</span>
                    <SortIcon field="displacement" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('elasticForce')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>탄성력 (N)</span>
                    <SortIcon field="elasticForce" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('springConstant')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                  >
                    <span>용수철상수 (N/m)</span>
                    <SortIcon field="springConstant" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">작업</th>
              </tr>
            </thead>
            <tbody>
              {sortedMeasurements.map((measurement, index) => (
                <tr
                  key={measurement.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-4 py-3 text-xs">
                    {new Date(measurement.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {measurement.naturalLength.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {measurement.currentLength.toFixed(1)}
                  </td>
                  <td className={`px-4 py-3 text-center font-mono font-bold ${
                    measurement.displacement > 0 ? 'text-red-600' :
                    measurement.displacement < 0 ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {measurement.displacement > 0 ? '+' : ''}{measurement.displacement.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-purple-600">
                    {Math.abs(measurement.elasticForce).toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    {measurement.springConstant.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onRemoveMeasurement(measurement.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
                      title="이 측정값 삭제"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 데이터 사용 가이드 */}
      {measurements.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-indigo-800 mb-2">📋 데이터 활용 가이드</h3>
          <div className="text-sm text-indigo-700 space-y-1">
            <p>• <strong>정렬:</strong> 열 제목을 클릭하여 해당 값으로 정렬할 수 있습니다.</p>
            <p>• <strong>CSV 내보내기:</strong> 측정 데이터를 Excel이나 다른 프로그램에서 분석할 수 있습니다.</p>
            <p>• <strong>색상 코딩:</strong> 빨간색(인장), 파란색(압축), 회색(자연상태)로 변위를 구분합니다.</p>
            <p>• <strong>비교 분석:</strong> 동일한 변위에서 다른 용수철상수의 효과를 비교해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
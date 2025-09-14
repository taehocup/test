import { formatMeasurement } from '../utils/physics';

interface MeasurementPanelProps {
  naturalLength: number;
  currentLength: number;
  displacement: number;
  elasticForce: number;
  springConstant: number;
  onAddMeasurement: () => void;
}

export function MeasurementPanel({
  naturalLength,
  currentLength,
  displacement,
  elasticForce,
  springConstant,
  onAddMeasurement
}: MeasurementPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">측정값 패널</h2>
        <button
          onClick={onAddMeasurement}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          📊 측정값 기록
        </button>
      </div>

      {/* 훅의 법칙 공식 표시 */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">훅의 법칙 (Hook's Law)</h3>
        <div className="flex items-center justify-center space-x-4 text-lg">
          <span className="font-mono bg-white px-3 py-2 rounded border text-indigo-900 font-bold">
            F = k × x
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-indigo-700">
          <div className="text-center">
            <div className="font-semibold">F</div>
            <div>탄성력 (N)</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">k</div>
            <div>용수철상수 (N/m)</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">x</div>
            <div>변위 (m)</div>
          </div>
        </div>
      </div>

      {/* 측정값들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 기본 길이 정보 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-3">길이 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700">자연길이:</span>
              <span className="font-mono text-lg font-bold text-green-900">
                {formatMeasurement(naturalLength, 'cm')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">현재길이:</span>
              <span className="font-mono text-lg font-bold text-green-900">
                {formatMeasurement(currentLength, 'cm')}
              </span>
            </div>
            <hr className="border-green-200" />
            <div className="flex justify-between items-center">
              <span className="text-green-700">변위 (x):</span>
              <div className="text-right">
                <span className={`font-mono text-lg font-bold ${
                  displacement > 0 ? 'text-red-600' : displacement < 0 ? 'text-blue-600' : 'text-green-900'
                }`}>
                  {displacement > 0 ? '+' : ''}{formatMeasurement(displacement, 'cm')}
                </span>
                <div className="text-xs text-gray-500">
                  ({formatMeasurement(displacement * 0.01, 'm')})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 물리 계산 결과 */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-purple-800 mb-3">물리량</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-700">용수철상수 (k):</span>
              <span className="font-mono text-lg font-bold text-purple-900">
                {formatMeasurement(springConstant, 'N/m')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700">탄성력 (F):</span>
              <span className="font-mono text-lg font-bold text-purple-900">
                {formatMeasurement(Math.abs(elasticForce), 'N')}
              </span>
            </div>
            <hr className="border-purple-200" />
            <div className="text-xs text-purple-600 bg-white p-2 rounded">
              <div className="flex justify-between">
                <span>계산:</span>
                <span className="font-mono">
                  {springConstant} × {(displacement * 0.01).toFixed(3)} = {Math.abs(elasticForce).toFixed(3)} N
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 인디케이터 */}
      <div className="flex items-center justify-center space-x-6 py-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            Math.abs(displacement) < 0.1 ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">자연상태</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            displacement > 0.1 ? 'bg-red-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">인장</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            displacement < -0.1 ? 'bg-blue-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">압축</span>
        </div>
      </div>

      {/* 교육적 설명 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">💡 물리학적 개념</h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <p>
            <strong>용수철 상수(k):</strong> 용수철의 단단함을 나타내는 값입니다.
            큰 값일수록 같은 힘에 대해 적게 변형됩니다.
          </p>
          <p>
            <strong>탄성력:</strong> 용수철이 원래 상태로 돌아가려는 복원력입니다.
            변위에 비례하여 증가합니다.
          </p>
          <p>
            <strong>선형 관계:</strong> 탄성 한계 내에서 힘과 변위는 정비례 관계를 갖습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
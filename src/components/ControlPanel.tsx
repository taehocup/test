import { PHYSICS_CONSTANTS } from '../utils/physics';

interface ControlPanelProps {
  naturalLength: number;
  springConstant: number;
  onNaturalLengthChange: (length: number) => void;
  onSpringConstantChange: (constant: number) => void;
  onReset: () => void;
}

export function ControlPanel({
  naturalLength,
  springConstant,
  onNaturalLengthChange,
  onSpringConstantChange,
  onReset
}: ControlPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">설정 패널</h2>
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          🔄 초기값 복원
        </button>
      </div>

      {/* 자연길이 설정 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              자연길이 (Natural Length)
            </label>
            <span className="text-lg font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {naturalLength.toFixed(1)} cm
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={30}
            step={0.5}
            value={naturalLength}
            onChange={(e) => onNaturalLengthChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((naturalLength - 10) / 20) * 100}%, #cbd5e1 ${((naturalLength - 10) / 20) * 100}%, #cbd5e1 100%)`
            }}
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10 cm</span>
            <span>기본: {PHYSICS_CONSTANTS.DEFAULT_NATURAL_LENGTH} cm</span>
            <span>30 cm</span>
          </div>

          <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
            💡 <strong>자연길이:</strong> 외부 힘이 작용하지 않을 때 용수철의 길이입니다.
          </div>
        </div>
      </div>

      {/* 용수철 상수 설정 */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              용수철상수 (Spring Constant)
            </label>
            <span className="text-lg font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded">
              {springConstant.toFixed(0)} N/m
            </span>
          </div>

          <input
            type="range"
            min={PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT}
            max={PHYSICS_CONSTANTS.MAX_SPRING_CONSTANT}
            step={1}
            value={springConstant}
            onChange={(e) => onSpringConstantChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((springConstant - PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT) / (PHYSICS_CONSTANTS.MAX_SPRING_CONSTANT - PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT)) * 100}%, #cbd5e1 ${((springConstant - PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT) / (PHYSICS_CONSTANTS.MAX_SPRING_CONSTANT - PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT)) * 100}%, #cbd5e1 100%)`
            }}
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT} N/m</span>
            <span>기본: {PHYSICS_CONSTANTS.DEFAULT_SPRING_CONSTANT} N/m</span>
            <span>{PHYSICS_CONSTANTS.MAX_SPRING_CONSTANT} N/m</span>
          </div>

          <div className="mt-2 text-sm text-gray-600 bg-purple-50 p-2 rounded">
            💡 <strong>용수철상수:</strong> 용수철의 단단함을 나타냅니다. 값이 클수록 단단한 용수철입니다.
          </div>
        </div>
      </div>

      {/* 용수철 상수별 특성 안내 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">용수철 상수별 특성</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-400"></div>
            <span className="text-gray-600">
              <strong>낮은 값 (1-50 N/m):</strong> 부드러운 용수철 - 작은 힘으로도 많이 변형
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-yellow-400"></div>
            <span className="text-gray-600">
              <strong>중간 값 (50-100 N/m):</strong> 보통 용수철 - 적당한 힘에 적당한 변형
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-400"></div>
            <span className="text-gray-600">
              <strong>높은 값 (100-200 N/m):</strong> 단단한 용수철 - 큰 힘으로도 조금만 변형
            </span>
          </div>
        </div>
      </div>

      {/* 빠른 설정 버튼들 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">빠른 설정</h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              onNaturalLengthChange(15);
              onSpringConstantChange(25);
            }}
            className="w-full p-2 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors duration-200 text-sm"
          >
            <div className="font-medium text-green-800">부드러운 용수철</div>
            <div className="text-green-600">자연길이: 15cm, 용수철상수: 25 N/m</div>
          </button>

          <button
            onClick={() => {
              onNaturalLengthChange(20);
              onSpringConstantChange(50);
            }}
            className="w-full p-2 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200 text-sm"
          >
            <div className="font-medium text-blue-800">표준 용수철</div>
            <div className="text-blue-600">자연길이: 20cm, 용수철상수: 50 N/m</div>
          </button>

          <button
            onClick={() => {
              onNaturalLengthChange(25);
              onSpringConstantChange(100);
            }}
            className="w-full p-2 text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200 text-sm"
          >
            <div className="font-medium text-red-800">단단한 용수철</div>
            <div className="text-red-600">자연길이: 25cm, 용수철상수: 100 N/m</div>
          </button>
        </div>
      </div>

      {/* 실험 팁 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔬 실험 팁</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 용수철 상수를 바꿔가며 같은 길이에서의 힘 변화를 관찰하세요</li>
          <li>• 자연길이를 변경하여 변위의 개념을 이해하세요</li>
          <li>• 다양한 설정에서 측정값을 기록하고 비교해보세요</li>
        </ul>
      </div>
    </div>
  );
}
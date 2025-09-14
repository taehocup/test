import { useDragHandler } from '../hooks/useDragHandler';
import { formatMeasurement } from '../utils/physics';

interface SpringVisualizerProps {
  currentLength: number;
  naturalLength: number;
  springConstant: number;
  displacement: number;
  elasticForce: number;
  onLengthChange: (length: number) => void;
}

export function SpringVisualizer({
  currentLength,
  naturalLength,
  displacement,
  elasticForce,
  onLengthChange
}: SpringVisualizerProps) {
  const containerHeight = 400;
  const containerWidth = 300;
  const springTopY = 50;
  const springWidth = 40;

  const {
    containerRef,
    isDragging,
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
    handleContainerClick
  } = useDragHandler({
    onLengthChange,
    currentLength,
    naturalLength,
    containerHeight,
    springTopY
  });

  // 용수철 길이를 픽셀로 변환 (5cm ~ 50cm -> springTopY ~ containerHeight-50)
  const lengthToPixels = (length: number) => {
    const minLength = 5;
    const maxLength = 50;
    const maxPixels = containerHeight - springTopY - 50;

    const ratio = (length - minLength) / (maxLength - minLength);
    return springTopY + maxPixels * ratio;
  };

  const currentPixelLength = lengthToPixels(currentLength);
  const naturalPixelLength = lengthToPixels(naturalLength);

  // 용수철 스프링 경로 생성
  const generateSpringPath = (startY: number, endY: number, width: number) => {
    const springLength = endY - startY;
    const coilCount = Math.max(8, Math.min(20, Math.floor(springLength / 15))); // 길이에 따라 코일 수 조정
    const coilHeight = springLength / coilCount;

    let path = `M ${containerWidth / 2 - width / 2} ${startY}`;

    for (let i = 0; i < coilCount; i++) {
      const y1 = startY + i * coilHeight;
      const y2 = startY + (i + 0.5) * coilHeight;
      const y3 = startY + (i + 1) * coilHeight;

      path += ` L ${containerWidth / 2 - width / 2} ${y1}`;
      path += ` Q ${containerWidth / 2 + width / 2} ${y2} ${containerWidth / 2 - width / 2} ${y3}`;
    }

    path += ` L ${containerWidth / 2 - width / 2} ${endY}`;
    return path;
  };

  // 용수철 색상 결정 (압축/인장에 따라)
  const getSpringColor = () => {
    if (Math.abs(displacement) < 0.1) return '#6b7280'; // 자연 상태 - 회색
    return displacement > 0 ? '#dc2626' : '#2563eb'; // 인장 - 빨강, 압축 - 파랑
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">용수철 시뮬레이션</h2>

      {/* 조작 안내 */}
      <div className="text-sm text-gray-600 text-center">
        <p>용수철 끝을 드래그하거나 클릭하여 길이를 조절하세요</p>
        <p>키보드: ↑↓ (미세조정), Home (자연길이)</p>
      </div>

      {/* 용수철 시각화 영역 */}
      <div
        ref={containerRef}
        className={`relative border-2 border-gray-300 rounded-lg bg-gradient-to-b from-blue-50 to-white cursor-pointer select-none ${
          isDragging ? 'border-blue-500' : ''
        }`}
        style={{ width: containerWidth, height: containerHeight }}
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="용수철 길이 조절"
        aria-valuemin={5}
        aria-valuemax={50}
        aria-valuenow={currentLength}
        aria-valuetext={`${currentLength.toFixed(1)}cm`}
      >
        <svg width={containerWidth} height={containerHeight} className="absolute inset-0">
          {/* 배경 격자 */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 고정점 (상단) */}
          <rect
            x={containerWidth / 2 - 30}
            y={springTopY - 20}
            width={60}
            height={15}
            fill="#374151"
            rx={2}
          />
          <text
            x={containerWidth / 2}
            y={springTopY - 25}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            고정점
          </text>

          {/* 자연길이 표시선 (점선) */}
          <line
            x1={containerWidth / 2 - springWidth}
            y1={naturalPixelLength}
            x2={containerWidth / 2 + springWidth}
            y2={naturalPixelLength}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5,5"
            opacity={0.7}
          />
          <text
            x={containerWidth / 2 + springWidth + 5}
            y={naturalPixelLength + 4}
            className="text-xs fill-green-600"
          >
            자연길이
          </text>

          {/* 용수철 스프링 부분 */}
          <path
            d={generateSpringPath(springTopY, currentPixelLength - 20, springWidth)}
            fill="none"
            stroke={getSpringColor()}
            strokeWidth={3}
            strokeLinecap="round"
            className="transition-colors duration-200"
          />

          {/* 드래그 가능한 하단 무게 */}
          <g
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            className="transition-transform duration-100 hover:scale-105"
          >
            <rect
              x={containerWidth / 2 - 25}
              y={currentPixelLength - 10}
              width={50}
              height={20}
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth={2}
              rx={4}
            />
            <text
              x={containerWidth / 2}
              y={currentPixelLength + 4}
              textAnchor="middle"
              className="text-xs fill-white font-semibold"
            >
              무게
            </text>
          </g>

          {/* 현재 길이 표시 */}
          <line
            x1={20}
            y1={springTopY}
            x2={20}
            y2={currentPixelLength}
            stroke="#6b7280"
            strokeWidth={2}
          />
          <text
            x={25}
            y={springTopY + (currentPixelLength - springTopY) / 2}
            className="text-xs fill-gray-600"
            dominantBaseline="middle"
          >
            {formatMeasurement(currentLength, 'cm')}
          </text>

          {/* 변위 표시 화살표 */}
          {Math.abs(displacement) > 0.1 && (
            <g>
              <line
                x1={containerWidth - 40}
                y1={naturalPixelLength}
                x2={containerWidth - 40}
                y2={currentPixelLength}
                stroke={displacement > 0 ? '#dc2626' : '#2563eb'}
                strokeWidth={3}
              />
              <polygon
                points={`${containerWidth - 45},${currentPixelLength - (displacement > 0 ? 10 : -10)} ${containerWidth - 35},${currentPixelLength - (displacement > 0 ? 10 : -10)} ${containerWidth - 40},${currentPixelLength}`}
                fill={displacement > 0 ? '#dc2626' : '#2563eb'}
              />
              <text
                x={containerWidth - 60}
                y={naturalPixelLength + (currentPixelLength - naturalPixelLength) / 2}
                className="text-xs font-semibold"
                fill={displacement > 0 ? '#dc2626' : '#2563eb'}
                dominantBaseline="middle"
                textAnchor="end"
              >
                {displacement > 0 ? '늘어남' : '압축'}
              </text>
            </g>
          )}
        </svg>

        {/* 드래그 중 피드백 */}
        {isDragging && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            드래그 중: {formatMeasurement(currentLength, 'cm')}
          </div>
        )}
      </div>

      {/* 실시간 측정값 표시 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">변위</div>
          <div className={`text-lg font-bold ${displacement > 0 ? 'text-red-600' : displacement < 0 ? 'text-blue-600' : 'text-gray-800'}`}>
            {formatMeasurement(Math.abs(displacement), 'cm')}
          </div>
          <div className="text-xs text-gray-500">
            {displacement > 0 ? '인장' : displacement < 0 ? '압축' : '자연상태'}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">탄성력</div>
          <div className="text-lg font-bold text-purple-600">
            {formatMeasurement(Math.abs(elasticForce), 'N')}
          </div>
          <div className="text-xs text-gray-500">F = k × x</div>
        </div>
      </div>
    </div>
  );
}
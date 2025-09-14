import { useState } from 'react';
import { SpringVisualizer } from './components/SpringVisualizer';
import { MeasurementPanel } from './components/MeasurementPanel';
import { ControlPanel } from './components/ControlPanel';
import { ForceGraph } from './components/ForceGraph';
import { DataTable } from './components/DataTable';
import { useSpringPhysics } from './hooks/useSpringPhysics';

type ActiveTab = 'overview' | 'graph' | 'data';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const {
    naturalLength,
    currentLength,
    springConstant,
    displacement,
    elasticForce,
    measurements,
    updateNaturalLength,
    updateCurrentLength,
    updateSpringConstant,
    addMeasurement,
    removeMeasurement,
    clearMeasurements,
    resetToDefaults,
    downloadCSV,
  } = useSpringPhysics();

  const TabButton = ({ id, label, isActive }: { id: ActiveTab; label: string; isActive: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🌀 용수철 탄성력 측정 웹앱
              </h1>
              <p className="text-gray-600 mt-1">
                훅의 법칙(Hook's Law)을 시각적으로 학습하고 실험하는 교육용 도구
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">물리학 실험 도구</div>
              <div className="text-xs text-gray-400">React + TypeScript</div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-2 mt-6">
            <TabButton id="overview" label="📊 실험 개요" isActive={activeTab === 'overview'} />
            <TabButton id="graph" label="📈 그래프 분석" isActive={activeTab === 'graph'} />
            <TabButton id="data" label="📋 데이터 표" isActive={activeTab === 'data'} />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 왼쪽: 용수철 시각화 */}
            <div className="xl:col-span-1">
              <SpringVisualizer
                currentLength={currentLength}
                naturalLength={naturalLength}
                springConstant={springConstant}
                displacement={displacement}
                elasticForce={elasticForce}
                onLengthChange={updateCurrentLength}
              />
            </div>

            {/* 중앙: 측정값 패널 */}
            <div className="xl:col-span-1">
              <MeasurementPanel
                naturalLength={naturalLength}
                currentLength={currentLength}
                displacement={displacement}
                elasticForce={elasticForce}
                springConstant={springConstant}
                onAddMeasurement={addMeasurement}
              />
            </div>

            {/* 오른쪽: 설정 패널 */}
            <div className="xl:col-span-1">
              <ControlPanel
                naturalLength={naturalLength}
                springConstant={springConstant}
                onNaturalLengthChange={updateNaturalLength}
                onSpringConstantChange={updateSpringConstant}
                onReset={resetToDefaults}
              />
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="space-y-6">
            <ForceGraph
              measurements={measurements}
              currentDisplacement={displacement}
              currentElasticForce={elasticForce}
              springConstant={springConstant}
            />

            {/* 간단한 조작 패널 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">빠른 조작</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      현재길이: {currentLength.toFixed(1)} cm
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      step={0.1}
                      value={currentLength}
                      onChange={(e) => updateCurrentLength(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={addMeasurement}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    현재값 측정 기록
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">실험 현황</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">측정점 수:</span>
                    <span className="font-semibold">{measurements.length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">용수철상수:</span>
                    <span className="font-semibold">{springConstant} N/m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">현재 변위:</span>
                    <span className={`font-semibold ${
                      displacement > 0 ? 'text-red-600' : displacement < 0 ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {displacement.toFixed(1)} cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">현재 탄성력:</span>
                    <span className="font-semibold text-purple-600">
                      {Math.abs(elasticForce).toFixed(3)} N
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <DataTable
            measurements={measurements}
            onRemoveMeasurement={removeMeasurement}
            onClearMeasurements={clearMeasurements}
            onDownloadCSV={downloadCSV}
          />
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>용수철 탄성력 측정 웹앱</strong> - 교육용 물리학 실험 도구
            </p>
            <p className="text-sm">
              훅의 법칙(F = kx)을 시각적으로 학습하고 다양한 실험을 통해 물리학적 개념을 이해할 수 있습니다.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>단위: 길이(cm), 힘(N), 용수철상수(N/m)</p>
              <p>키보드 단축키: ↑↓ (길이조절), Home (자연길이), Shift+↑↓ (큰 단위 조절)</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

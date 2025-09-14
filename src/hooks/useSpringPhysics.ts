import { useState, useCallback, useMemo } from 'react';
import type { SpringState, Measurement } from '../types/spring';
import {
  calculateSpringPhysics,
  PHYSICS_CONSTANTS,
  validateSpringLength,
  validateSpringConstant
} from '../utils/physics';

export function useSpringPhysics() {
  const [naturalLength, setNaturalLength] = useState(PHYSICS_CONSTANTS.DEFAULT_NATURAL_LENGTH);
  const [currentLength, setCurrentLength] = useState(PHYSICS_CONSTANTS.DEFAULT_NATURAL_LENGTH);
  const [springConstant, setSpringConstant] = useState(PHYSICS_CONSTANTS.DEFAULT_SPRING_CONSTANT);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  // 물리값 계산 (메모화)
  const physicsData = useMemo(() => {
    return calculateSpringPhysics(currentLength, naturalLength, springConstant);
  }, [currentLength, naturalLength, springConstant]);

  // 전체 상태 객체 (메모화)
  const springState: SpringState = useMemo(() => ({
    naturalLength,
    currentLength,
    springConstant,
    displacement: physicsData.displacement,
    elasticForce: physicsData.elasticForce,
    measurements,
  }), [naturalLength, currentLength, springConstant, physicsData, measurements]);

  // 자연 길이 설정 (유효성 검사 포함)
  const updateNaturalLength = useCallback((length: number) => {
    const validLength = validateSpringLength(length);
    setNaturalLength(validLength);

    // 현재 길이가 자연 길이보다 작아지면 현재 길이도 조정
    if (currentLength < validLength) {
      setCurrentLength(validLength);
    }
  }, [currentLength]);

  // 현재 길이 설정 (유효성 검사 포함)
  const updateCurrentLength = useCallback((length: number) => {
    const validLength = validateSpringLength(length);
    setCurrentLength(validLength);
  }, []);

  // 용수철 상수 설정 (유효성 검사 포함)
  const updateSpringConstant = useCallback((constant: number) => {
    const validConstant = validateSpringConstant(constant);
    setSpringConstant(validConstant);
  }, []);

  // 측정값 기록
  const addMeasurement = useCallback(() => {
    const measurement: Measurement = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      naturalLength,
      currentLength,
      displacement: physicsData.displacement,
      elasticForce: physicsData.elasticForce,
      springConstant,
    };

    setMeasurements(prev => [...prev, measurement]);
  }, [naturalLength, currentLength, springConstant, physicsData]);

  // 측정값 삭제
  const removeMeasurement = useCallback((id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  }, []);

  // 모든 측정값 삭제
  const clearMeasurements = useCallback(() => {
    setMeasurements([]);
  }, []);

  // 초기값으로 리셋
  const resetToDefaults = useCallback(() => {
    setNaturalLength(PHYSICS_CONSTANTS.DEFAULT_NATURAL_LENGTH);
    setCurrentLength(PHYSICS_CONSTANTS.DEFAULT_NATURAL_LENGTH);
    setSpringConstant(PHYSICS_CONSTANTS.DEFAULT_SPRING_CONSTANT);
    setMeasurements([]);
  }, []);

  // CSV로 측정값 내보내기
  const exportMeasurementsAsCSV = useCallback(() => {
    if (measurements.length === 0) return '';

    const headers = [
      '시간', '자연길이(cm)', '현재길이(cm)',
      '변위(cm)', '탄성력(N)', '용수철상수(N/m)'
    ];

    const rows = measurements.map(m => [
      new Date(m.timestamp).toLocaleString(),
      m.naturalLength.toFixed(2),
      m.currentLength.toFixed(2),
      m.displacement.toFixed(2),
      m.elasticForce.toFixed(2),
      m.springConstant.toFixed(2)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }, [measurements]);

  // CSV 파일 다운로드
  const downloadCSV = useCallback(() => {
    const csvContent = exportMeasurementsAsCSV();
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `spring_measurements_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [exportMeasurementsAsCSV]);

  return {
    // 상태
    springState,

    // 개별 값들 (편의상 제공)
    naturalLength,
    currentLength,
    springConstant,
    displacement: physicsData.displacement,
    elasticForce: physicsData.elasticForce,
    measurements,

    // 업데이트 함수들
    updateNaturalLength,
    updateCurrentLength,
    updateSpringConstant,

    // 측정값 관리
    addMeasurement,
    removeMeasurement,
    clearMeasurements,

    // 유틸리티
    resetToDefaults,
    exportMeasurementsAsCSV,
    downloadCSV,
  };
}
// 훅의 법칙: F = k * x
// F: 탄성력 (N)
// k: 용수철 상수 (N/m)
// x: 변위 (m)

export const PHYSICS_CONSTANTS = {
  CM_TO_M: 0.01,           // cm를 m로 변환
  M_TO_CM: 100,            // m를 cm으로 변환
  DEFAULT_NATURAL_LENGTH: 15, // 기본 자연 길이 (cm)
  DEFAULT_SPRING_CONSTANT: 50, // 기본 용수철 상수 (N/m)
  MIN_LENGTH: 5,           // 최소 길이 (cm)
  MAX_LENGTH: 50,          // 최대 길이 (cm)
  MIN_SPRING_CONSTANT: 1,  // 최소 용수철 상수 (N/m)
  MAX_SPRING_CONSTANT: 200, // 최대 용수철 상수 (N/m)
};

// 훅의 법칙에 따른 탄성력 계산
export function calculateElasticForce(
  springConstant: number, // N/m
  displacement: number    // cm
): number {
  // cm를 m로 변환 후 계산
  const displacementInMeters = displacement * PHYSICS_CONSTANTS.CM_TO_M;
  return springConstant * displacementInMeters; // N
}

// 변위 계산 (늘어난 길이)
export function calculateDisplacement(
  currentLength: number,  // cm
  naturalLength: number   // cm
): number {
  return currentLength - naturalLength; // cm
}

// 용수철 상수로부터 탄성력 계산 (전체 과정)
export function calculateSpringPhysics(
  currentLength: number,   // cm
  naturalLength: number,   // cm
  springConstant: number   // N/m
) {
  const displacement = calculateDisplacement(currentLength, naturalLength);
  const elasticForce = calculateElasticForce(springConstant, displacement);

  return {
    displacement,
    elasticForce,
    displacementInMeters: displacement * PHYSICS_CONSTANTS.CM_TO_M,
  };
}

// 용수철 길이 유효성 검사
export function validateSpringLength(length: number): number {
  return Math.max(
    PHYSICS_CONSTANTS.MIN_LENGTH,
    Math.min(PHYSICS_CONSTANTS.MAX_LENGTH, length)
  );
}

// 용수철 상수 유효성 검사
export function validateSpringConstant(constant: number): number {
  return Math.max(
    PHYSICS_CONSTANTS.MIN_SPRING_CONSTANT,
    Math.min(PHYSICS_CONSTANTS.MAX_SPRING_CONSTANT, constant)
  );
}

// 값을 소수점 둘째 자리까지 반올림
export function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

// 측정값을 사람이 읽기 쉬운 형태로 포맷팅
export function formatMeasurement(value: number, unit: string): string {
  return `${roundToTwo(value)} ${unit}`;
}
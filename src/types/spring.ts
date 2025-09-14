export interface SpringState {
  naturalLength: number;    // 자연길이 (cm)
  currentLength: number;    // 현재길이 (cm)
  springConstant: number;   // 용수철상수 (N/m)
  displacement: number;     // 늘어난길이 (cm) - 현재길이 - 자연길이
  elasticForce: number;     // 탄성력 (N)
  measurements: Measurement[];  // 측정 기록
}

export interface Measurement {
  id: string;
  timestamp: number;
  naturalLength: number;
  currentLength: number;
  displacement: number;
  elasticForce: number;
  springConstant: number;
}

export interface SpringConfig {
  minLength: number;        // 최소 길이 (cm)
  maxLength: number;        // 최대 길이 (cm)
  minSpringConstant: number; // 최소 용수철 상수 (N/m)
  maxSpringConstant: number; // 최대 용수철 상수 (N/m)
  defaultNaturalLength: number; // 기본 자연 길이 (cm)
  defaultSpringConstant: number; // 기본 용수철 상수 (N/m)
}

export interface Position {
  x: number;
  y: number;
}
import { useState, useCallback, useRef, useEffect } from 'react';
import type { Position } from '../types/spring';
import { validateSpringLength } from '../utils/physics';

interface DragHandlerOptions {
  onLengthChange: (length: number) => void;
  currentLength: number;
  naturalLength: number;
  containerHeight: number; // 드래그 가능한 영역의 높이
  springTopY: number;      // 용수철 상단의 Y 좌표
}

export function useDragHandler({
  onLengthChange,
  currentLength,
  naturalLength,
  containerHeight,
  springTopY
}: DragHandlerOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState<Position>({ x: 0, y: 0 });
  const [initialLength, setInitialLength] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 마우스/터치 위치를 컨테이너 상대 좌표로 변환
  const getRelativePosition = useCallback((clientX: number, clientY: number): Position => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  // Y 좌표를 용수철 길이로 변환
  const yPositionToLength = useCallback((y: number): number => {
    // Y 좌표가 클수록 용수철이 늘어난 것
    const pixelsFromTop = y - springTopY;
    const lengthRatio = pixelsFromTop / containerHeight;

    // 5cm에서 50cm 사이로 매핑
    const minLength = 5;
    const maxLength = 50;
    const calculatedLength = minLength + (maxLength - minLength) * lengthRatio;

    return validateSpringLength(calculatedLength);
  }, [containerHeight, springTopY]);

  // 드래그 시작
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    const position = getRelativePosition(clientX, clientY);
    setIsDragging(true);
    setDragStartPosition(position);
    setInitialLength(currentLength);
  }, [getRelativePosition, currentLength]);

  // 드래그 중
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const currentPosition = getRelativePosition(clientX, clientY);
    const deltaY = currentPosition.y - dragStartPosition.y;

    // Y축 이동량을 길이 변화로 변환
    // 컨테이너 높이를 45cm 범위(5-50cm)에 매핑
    const lengthPerPixel = 45 / containerHeight;
    const deltaLength = deltaY * lengthPerPixel;

    const newLength = validateSpringLength(initialLength + deltaLength);
    onLengthChange(newLength);
  }, [isDragging, dragStartPosition, getRelativePosition, initialLength, onLengthChange, containerHeight]);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStartPosition({ x: 0, y: 0 });
    setInitialLength(0);
  }, []);

  // 마우스 이벤트 핸들러들
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 터치 이벤트 핸들러들
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 전역 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // 키보드 접근성을 위한 핸들러
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1; // Shift 키를 누르면 더 큰 단위로 이동

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onLengthChange(validateSpringLength(currentLength - step));
        break;
      case 'ArrowDown':
        e.preventDefault();
        onLengthChange(validateSpringLength(currentLength + step));
        break;
      case 'Home':
        e.preventDefault();
        onLengthChange(naturalLength);
        break;
      default:
        break;
    }
  }, [currentLength, naturalLength, onLengthChange]);

  // 드래그 가능한 영역 클릭으로 직접 설정
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return; // 드래그 중이면 무시

    const position = getRelativePosition(e.clientX, e.clientY);
    const newLength = yPositionToLength(position.y);
    onLengthChange(newLength);
  }, [isDragging, getRelativePosition, yPositionToLength, onLengthChange]);

  return {
    containerRef,
    isDragging,

    // 이벤트 핸들러들
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
    handleContainerClick,

    // 유틸리티
    getRelativePosition,
    yPositionToLength,
  };
}
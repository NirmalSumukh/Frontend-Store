import { useRef, TouchEvent } from "react";

interface SwipeHandlers {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
}

interface SwipeableReturn {
  onTouchStart: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}

export function useSwipeable({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
}: SwipeHandlers): SwipeableReturn {
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    // FIX: Add null check for targetTouches[0]
    const touch = e.targetTouches[0];
    if (!touch) return;

    touchEnd.current = { x: 0, y: 0 };
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const onTouchEnd = (e: TouchEvent) => {
    // FIX: Add null check for changedTouches[0]
    const touch = e.changedTouches[0];
    if (!touch) return;

    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe && onSwipedLeft) {
      onSwipedLeft();
    }

    if (isRightSwipe && onSwipedRight) {
      onSwipedRight();
    }

    if (isUpSwipe && onSwipedUp) {
      onSwipedUp();
    }

    if (isDownSwipe && onSwipedDown) {
      onSwipedDown();
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
}

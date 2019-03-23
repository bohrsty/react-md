import { useState, useRef, useCallback, useEffect } from "react";
import { MergableRippleHandlers } from "./types.d";

interface PressedStatesOptions<E extends HTMLElement = HTMLElement> {
  handlers?: MergableRippleHandlers<E>;
  disableSpacebarClick?: boolean;
}

/**
 * This is a different version of the useRippleStates that will allow you to know
 * when a component is being pressed by the user. This is really just a fallback for
 * when the ripples are disabled.
 *
 * This will return an object containing the current pressed state of the element as well
 * as all the merged eventHandlers required to trigger the different states.
 */
export function usePressedStates<E extends HTMLElement = HTMLElement>({
  handlers = {},
  disableSpacebarClick = false,
}: PressedStatesOptions<E>) {
  const [pressed, setPressed] = useState(false);
  const ref = useRef({ ...handlers, pressed });
  useEffect(() => {
    ref.current = {
      ...handlers,
      pressed,
    };
  });

  const handleTouchStart = useCallback((event: React.TouchEvent<E>) => {
    const { onTouchStart, pressed } = ref.current;
    if (onTouchStart) {
      onTouchStart(event);
    }

    if (!pressed) {
      setPressed(true);
    }
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent<E>) => {
    const { onTouchMove, pressed } = ref.current;
    if (onTouchMove) {
      onTouchMove(event);
    }

    if (pressed) {
      setPressed(false);
    }
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent<E>) => {
    const { onTouchEnd, pressed } = ref.current;
    if (onTouchEnd) {
      onTouchEnd(event);
    }

    if (pressed) {
      setPressed(false);
    }
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<E>) => {
    const { onMouseDown, pressed } = ref.current;
    if (onMouseDown) {
      onMouseDown(event);
    }

    if (!pressed && event.button === 0) {
      setPressed(true);
    }
  }, []);

  const handleMouseUp = useCallback((event: React.MouseEvent<E>) => {
    const { onMouseUp, pressed } = ref.current;
    if (onMouseUp) {
      onMouseUp(event);
    }

    if (pressed) {
      setPressed(false);
    }
  }, []);

  const handleMouseLeave = useCallback((event: React.MouseEvent<E>) => {
    const { onMouseLeave, pressed } = ref.current;
    if (onMouseLeave) {
      onMouseLeave(event);
    }

    if (pressed) {
      setPressed(false);
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<E>) => {
    const { onKeyDown, pressed } = ref.current;
    if (onKeyDown) {
      onKeyDown(event);
    }

    const { key } = event;
    if (
      !pressed &&
      (key === "Enter" || (!disableSpacebarClick && key === " "))
    ) {
      setPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((event: React.KeyboardEvent<E>) => {
    const { onKeyUp, pressed } = ref.current;
    if (onKeyUp) {
      onKeyUp(event);
    }

    if (pressed) {
      setPressed(false);
    }
  }, []);

  return {
    pressed,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
    },
  };
}

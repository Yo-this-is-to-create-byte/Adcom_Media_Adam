import React, { useEffect, useRef, useState } from 'react';

/**
 * Types `text` character-by-character. Calls onDone when finished.
 * `speed` = ms per character. `startDelay` = ms before typing begins.
 */
export default function Typewriter({
  text,
  speed = 26,
  startDelay = 0,
  className = '',
  showCaret = true,
  onDone,
  caretClassName = 'text-[#D72638]',
}) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const speedRef = useRef(speed);
  const startDelayRef = useRef(startDelay);
  onDoneRef.current = onDone;
  speedRef.current = speed;
  startDelayRef.current = startDelay;

  useEffect(() => {
    setCount(0);
    doneRef.current = false;
    let i = 0;
    let interval;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            onDoneRef.current && onDoneRef.current();
          }
        }
      }, speedRef.current);
    }, startDelayRef.current);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [text]);

  const finished = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCaret && (
        <span className={`adam-caret ${caretClassName} ${finished ? 'opacity-100' : ''}`}>▊</span>
      )}
    </span>
  );
}

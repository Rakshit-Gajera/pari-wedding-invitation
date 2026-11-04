import { useEffect, useRef, useState } from 'react';

/** Fades its element in the first time it reaches the screen. */
export default function Reveal({ as: Tag = 'div', className = '', onSeen, children, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
          onSeen?.();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onSeen]);

  return (
    <Tag ref={ref} className={`${className} rv${seen ? ' in' : ''}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

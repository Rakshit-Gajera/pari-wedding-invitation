import { useCallback, useEffect, useRef, useState } from 'react';

function copyWithSelection(text) {
  const box = document.createElement('textarea');
  box.value = text;
  box.setAttribute('readonly', '');
  box.style.cssText = 'position:fixed;top:0;opacity:0';
  document.body.appendChild(box);
  box.select();
  const worked = document.execCommand('copy');
  box.remove();
  return worked;
}

/** Copies text and reports `copied` for a moment, so a button can say it worked. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (text) => {
    let worked = false;
    try {
      await navigator.clipboard.writeText(text);
      worked = true;
    } catch {
      worked = copyWithSelection(text);
    }
    setCopied(worked);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }, []);

  return { copied, copy };
}

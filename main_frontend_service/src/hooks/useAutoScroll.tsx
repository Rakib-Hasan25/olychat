
import { useEffect, useRef, RefObject } from 'react';

export function useAutoScroll<T extends HTMLElement>(
  deps: any[],
  options?: { 
    behavior?: ScrollBehavior,
    smooth?: boolean
  }
): RefObject<T> {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const scrollToBottom = () => {
      const element = ref.current;
      if (element) {
        const scrollOptions: ScrollToOptions = { 
          top: element.scrollHeight,
          behavior: options?.smooth ? 'smooth' : 'auto'
        };
        
        element.scrollTo(scrollOptions);
      }
    };

    scrollToBottom();
    
    // Sometimes we need a slight delay for the DOM to update
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [...deps]);
  
  return ref;
}

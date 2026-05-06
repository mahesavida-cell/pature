import * as React from 'react';
import {cn} from '@/lib/utils';

/**
 * Standardized Textarea Component (Professional Geist Module)
 * Inherits 14px font size and radius from the input standard.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-[6px] border-none bg-white px-3 py-3 text-[14px] ring-offset-background placeholder:text-muted-foreground/40 placeholder:font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all leading-relaxed shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
          className
        )}
        ref={ref}
        style={{ fontSynthesis: 'none' }}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};

'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

// Native <select>-in açılan siyahısı brauzer/OS tərəfindən çəkilir və CSS
// ilə sayt dizaynına uyğunlaşdırıla bilmir. Bunun əvəzinə filtr sətirlərində
// (donors, requests) və form sahələrində (signup və s.) tam özəl, sayt
// dizaynında (rounded-md, border, accent seçili state) bir dropdown
// istifadə olunur.
//
// variant="filter" - kutu/border olmayan, sadə mətn+ox (filtr sətirləri üçün)
// variant="field"  - digər form input-ları ilə eyni bordered qutu (formalar üçün)
// Panel açıq olanda ehtiyac olan yer 256px (max-h-64) + kiçik boşluqdur -
// aşağıda bu qədər yer yoxdursa (məs. formun son sətri, ekranın altına
// yaxın), panel yuxarı açılır ki, səhifə boyu uzanıb lazımsız scrollbar
// yaratmasın.
const PANEL_SPACE = 280;

export default function FilterSelect({
  value, onChange, options, className, variant = 'filter', id,
}) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleToggle() {
    if (!open && ref.current) {
      const spaceBelow = window.innerHeight - ref.current.getBoundingClientRect().bottom;
      setOpenUpward(spaceBelow < PANEL_SPACE);
    }
    setOpen((o) => !o);
  }

  const selected = options.find((opt) => opt.value === value);
  const isField = variant === 'field';

  return (
    <div ref={ref} className={cn('relative inline-flex', isField && 'w-full', className)}>
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          isField
            ? 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3.5 text-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10'
            : 'inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary',
        )}
      >
        <span className={cn(isField && 'truncate text-foreground', isField && !value && 'text-muted-foreground/70')}>
          {selected?.label}
        </span>
        <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute left-0 z-20 max-h-64 overflow-y-auto rounded-md border border-border bg-card p-1 shadow-lg',
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
            isField ? 'w-full' : 'min-w-[11rem]',
          )}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
                opt.value === value ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-secondary',
              )}
            >
              {opt.label}
              {opt.value === value && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

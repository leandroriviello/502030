'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type GlassSelectOption<T extends string> = {
  value: T;
  label: string;
  icon?: string;
  description?: string;
};

interface GlassSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: GlassSelectOption<T>[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function GlassSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled
}: GlassSelectProps<T>): JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        className={`glass-input w-full px-4 py-3 rounded-apple flex items-center justify-between gap-3 focus:outline-none transition-all duration-200 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/10'
        }`}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!disabled) {
              setOpen((prev) => !prev);
            }
          }
          if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="flex items-center gap-2 truncate text-left">
          {selected ? (
            <>
              {selected.icon ? <span className="text-lg">{selected.icon}</span> : null}
              <span className="font-text text-foreground truncate">{selected.label}</span>
            </>
          ) : (
            <span className="font-text text-foreground-tertiary truncate">
              {placeholder ?? 'Selecciona una opción'}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`text-foreground-secondary transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-apple border border-white/10 bg-surface/90 backdrop-blur-xl shadow-2xl focus:outline-none"
            role="listbox"
            tabIndex={-1}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 focus:outline-none ${
                      isSelected
                        ? 'bg-white/10 text-foreground'
                        : 'text-foreground-secondary hover:bg-white/10'
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon ? <span className="text-lg">{option.icon}</span> : null}
                      <span className="font-text">{option.label}</span>
                    </span>
                    {option.description ? (
                      <span className="text-xs text-foreground-tertiary font-text">
                        {option.description}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

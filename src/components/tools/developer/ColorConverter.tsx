'use client';
import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { hexToRgb, rgbToHsl } from '@/lib/tools/dev';
import { InlineNote } from '@/components/ui/Result';

export function ColorConverter() {
  const [hex, setHex] = useState('#28926E');
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <div>
      <div className="flex items-end gap-4">
        <TextField label="HEX color" value={hex} onChange={(e) => setHex(e.target.value)} />
        <div className="h-11 w-11 rounded-md border border-ink-100" style={{ backgroundColor: rgb ? hex : '#fff' }} aria-hidden="true" />
      </div>
      {!rgb ? (
        <div className="mt-4"><InlineNote tone="warning">Enter a valid hex color like #28926E.</InlineNote></div>
      ) : (
        <div className="mt-5 space-y-2 text-sm text-ink-800">
          <p><strong>RGB:</strong> rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
          <p><strong>HSL:</strong> hsl({hsl!.h}, {hsl!.s}%, {hsl!.l}%)</p>
        </div>
      )}
    </div>
  );
}

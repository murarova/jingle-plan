// @ts-nocheck
'use client';
import React from 'react';
import { createProgress } from '@gluestack-ui/core/progress/creator';
import { View } from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

const SCOPE = 'PROGRESS';
export const UIProgress = createProgress({
  Root: withStyleContext(View, SCOPE),
  FilledTrack: View,
});

cssInterop(UIProgress, { className: 'style' });
cssInterop(UIProgress.FilledTrack, { className: 'style' });

const progressStyle = tva({
  base: 'bg-typography-300 relative h-2 w-full overflow-hidden rounded-full',
  variants: {
    orientation: {
      horizontal: 'w-full h-2',
      vertical: 'h-full w-2 justify-end',
    },
  },
});

const progressFilledTrackStyle = tva({
  base: 'h-full rounded-full',
  variants: {
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
});

type IProgressProps = VariantProps<typeof progressStyle> &
  React.ComponentProps<typeof UIProgress>;
type IProgressFilledTrackProps = VariantProps<typeof progressFilledTrackStyle> &
  React.ComponentProps<typeof UIProgress.FilledTrack>;

const getProgressPercentage = (value = 0, min = 0, max = 100) => {
  if (value < max && value > min) {
    return Math.round(((value - min) / (max - min)) * 100);
  }

  return value > min ? 100 : 0;
};

const Progress = React.forwardRef<
  React.ComponentRef<typeof UIProgress>,
  IProgressProps
>(function Progress(
  { className, orientation = 'horizontal', value = 0, min = 0, max = 100, ...props },
  ref
) {
  const percentage = getProgressPercentage(value, min, max);
  const valueWidth = orientation === 'horizontal' ? percentage : 100;
  const valueHeight = orientation === 'vertical' ? percentage : 100;

  return (
    <UIProgress
      ref={ref}
      value={value}
      min={min}
      max={max}
      {...props}
      className={progressStyle({ orientation, class: className })}
      context={{ orientation, valueWidth, valueHeight }}
      orientation={orientation}
    />
  );
});

const ProgressFilledTrack = React.forwardRef<
  React.ComponentRef<typeof UIProgress.FilledTrack>,
  IProgressFilledTrackProps
>(function ProgressFilledTrack({ className, style, ...props }, ref) {
  const { orientation: parentOrientation, valueWidth = 0, valueHeight = 100 } =
    useStyleContext(SCOPE) ?? {};

  const fillStyle =
    parentOrientation === 'vertical'
      ? { height: `${valueHeight}%`, width: '100%' as const }
      : { width: `${valueWidth}%`, height: '100%' as const };

  return (
    <UIProgress.FilledTrack
      ref={ref}
      {...props}
      style={[fillStyle, style]}
      className={progressFilledTrackStyle({
        orientation: parentOrientation,
        class: className,
      })}
    />
  );
});

export { Progress, ProgressFilledTrack };

// @ts-nocheck
'use client';
import { createSlider } from '@gluestack-ui/core/slider/creator';
import { Pressable } from 'react-native';
import { View } from 'react-native';
import React from 'react';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';

const SCOPE = 'SLIDER';
const Root = withStyleContext(View, SCOPE);
export const UISlider = createSlider({
  Root: Root,
  Thumb: View,
  Track: Pressable,
  FilledTrack: View,
  ThumbInteraction: View,
});

cssInterop(UISlider.Track, { className: 'style' });
cssInterop(UISlider.Thumb, { className: 'style' });
cssInterop(UISlider.FilledTrack, { className: 'style' });

const sliderStyle = tva({
  base: 'justify-center items-center data-[disabled=true]:opacity-40 data-[disabled=true]:web:pointer-events-none',
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
    isReversed: {
      true: '',
      false: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
});

const sliderThumbStyle = tva({
  base: 'bg-primary-500 absolute rounded-full web:cursor-pointer data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600',
  parentVariants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
});

const sliderTrackStyle = tva({
  base: 'bg-backgroundLight-300 rounded-lg overflow-hidden',
  parentVariants: {
    orientation: {
      horizontal: 'w-full flex-row',
      vertical: 'h-full flex-col-reverse',
    },
    size: {
      sm: 'h-1',
      md: 'h-[5px]',
      lg: 'h-1.5',
    },
    isReversed: {
      true: '',
      false: '',
    },
  },
  parentCompoundVariants: [
    {
      orientation: 'horizontal',
      isReversed: true,
      class: 'flex-row-reverse',
    },
    {
      orientation: 'vertical',
      isReversed: true,
      class: 'flex-col',
    },
  ],
});

const sliderFilledTrackStyle = tva({
  base: 'bg-primary-500',
  parentVariants: {
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
});

type ISliderProps = React.ComponentProps<typeof UISlider> &
  VariantProps<typeof sliderStyle>;

const Slider = React.forwardRef<
  React.ComponentRef<typeof UISlider>,
  ISliderProps
>(function Slider(
  {
    className,
    orientation = 'horizontal',
    isReversed = false,
    size = 'md',
    ...props
  },
  ref
) {
  return (
    <UISlider
      ref={ref}
      isReversed={isReversed}
      orientation={orientation}
      {...props}
      className={sliderStyle({
        orientation,
        isReversed,
        size,
        class: className,
      })}
      context={{ orientation, isReversed, size }}
    />
  );
});

type ISliderThumbProps = React.ComponentProps<typeof UISlider.Thumb> &
  VariantProps<typeof sliderThumbStyle>;

const SliderThumb = React.forwardRef<
  React.ComponentRef<typeof UISlider.Thumb>,
  ISliderThumbProps
>(function SliderThumb({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE) ?? {};

  return (
    <UISlider.Thumb
      ref={ref}
      {...props}
      className={sliderThumbStyle({
        parentVariants: {
          size: size ?? parentSize,
        },
        class: className,
      })}
    />
  );
});

type ISliderTrackProps = React.ComponentProps<typeof UISlider.Track> &
  VariantProps<typeof sliderTrackStyle>;

const SliderTrack = React.forwardRef<
  React.ComponentRef<typeof UISlider.Track>,
  ISliderTrackProps
>(function SliderTrack({ className, style, ...props }, ref) {
  const {
    orientation: parentOrientation,
    isReversed,
    size: parentSize,
  } = useStyleContext(SCOPE) ?? {};

  return (
    <UISlider.Track
      ref={ref}
      {...props}
      style={style}
      className={sliderTrackStyle({
        parentVariants: {
          orientation: parentOrientation,
          isReversed,
          size: parentSize,
        },
        class: className,
      })}
    />
  );
});

type ISliderFilledTrackProps = React.ComponentProps<
  typeof UISlider.FilledTrack
> &
  VariantProps<typeof sliderFilledTrackStyle>;

const SliderFilledTrack = React.forwardRef<
  React.ComponentRef<typeof UISlider.FilledTrack>,
  ISliderFilledTrackProps
>(function SliderFilledTrack({ className, ...props }, ref) {
  const { orientation: parentOrientation } = useStyleContext(SCOPE) ?? {};

  return (
    <UISlider.FilledTrack
      ref={ref}
      {...props}
      className={sliderFilledTrackStyle({
        parentVariants: {
          orientation: parentOrientation,
        },
        class: className,
      })}
    />
  );
});

export { Slider, SliderThumb, SliderTrack, SliderFilledTrack };

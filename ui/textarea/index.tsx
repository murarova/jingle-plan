// @ts-nocheck
'use client';
import React from 'react';
import { createTextarea } from '@gluestack-ui/core/textarea/creator';
import { View, TextInput } from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

const SCOPE = 'TEXTAREA';
const UITextarea = createTextarea({
  Root: withStyleContext(View, SCOPE),
  Input: TextInput,
});

const textareaStyle = tva({
  base: 'w-full h-[100px] border border-ivory-line bg-ivory-card rounded-sm data-[hover=true]:border-borderLight-400 data-[focus=true]:border-typography-600 data-[active=true]:border-typography-600 data-[focus=true]:data-[hover=true]:border-typography-600 data-[disabled=true]:opacity-40 data-[disabled=true]:data-[hover=true]:border-ivory-line',

  variants: {
    variant: {
      default:
        'data-[focus=true]:border-typography-600 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:web:shadow-typography-600 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-[inset_0_0_0_1px] data-[invalid=true]:web:shadow-error-700 data-[invalid=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[disabled=true]:data-[hover=true]:border-error-700',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
});

const textareaInputStyle = tva({
  base: 'p-2 flex-1 text-primaryText ios:font-system android:font-roboto placeholder:text-secondaryText web:outline-0 web:outline-none web:cursor-text web:data-[disabled=true]:cursor-not-allowed',
  parentVariants: {
    size: {
      sm: 'ios:text-[15px] android:text-[14px]',
      md: 'ios:text-[17px] android:text-[16px]',
      lg: 'ios:text-[18px] android:text-[18px]',
      xl: 'ios:text-[20px] android:text-[20px]',
    },
  },
});

type ITextareaProps = React.ComponentProps<typeof UITextarea> &
  VariantProps<typeof textareaStyle>;

const Textarea = React.forwardRef<
  React.ComponentRef<typeof UITextarea>,
  ITextareaProps
>(function Textarea(
  { className, variant = 'default', size = 'md', ...props },
  ref
) {
  return (
    <UITextarea
      ref={ref}
      {...props}
      className={textareaStyle({ variant, class: className })}
      context={{ size }}
    />
  );
});

type ITextareaInputProps = React.ComponentProps<typeof UITextarea.Input> &
  VariantProps<typeof textareaInputStyle>;

const TextareaInput = React.forwardRef<
  React.ComponentRef<typeof UITextarea.Input>,
  ITextareaInputProps
>(function TextareaInput({ className, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  return (
    <UITextarea.Input
      ref={ref}
      {...props}
      textAlignVertical="top"
      className={textareaInputStyle({
        parentVariants: {
          size: parentSize,
        },
        class: className,
      })}
    />
  );
});

Textarea.displayName = 'Textarea';
TextareaInput.displayName = 'TextareaInput';

export { Textarea, TextareaInput };

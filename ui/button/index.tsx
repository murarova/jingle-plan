// @ts-nocheck
'use client';
import React from 'react';
import { createButton } from '@gluestack-ui/core/button/creator';
import {
  tva,
  withStyleContext,
  useStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);
const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});
cssInterop(UIIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});
const buttonStyle = tva({
  base: 'rounded-lg flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[disabled=true]:opacity-40 gap-2',
  variants: {
    variant: {
      default:
        'bg-primary-500 border-0 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700',
      solid:
        'bg-primary-500 border-0 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700',
      outline:
        'bg-transparent border border-primary-300 data-[hover=true]:bg-backgroundLight-50 data-[active=true]:bg-transparent',
      secondary:
        'bg-secondary-500 border-0 data-[hover=true]:bg-secondary-600 data-[active=true]:bg-secondary-700',
      destructive:
        'bg-red-500 border-0 data-[hover=true]:bg-red-600 data-[active=true]:bg-red-700',
      ghost:
        'bg-transparent data-[hover=true]:bg-backgroundLight-50 data-[active=true]:bg-transparent',
      link: 'h-auto min-h-0 px-0 py-0 bg-transparent border-0 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    size: {
      xs: 'px-3.5 h-8',
      sm: 'px-4 h-9',
      default: 'px-5 h-11',
      md: 'px-5 h-11',
      lg: 'px-6 h-11',
      xl: 'px-7 h-12',
      icon: 'h-10 w-10',
    },
  },
  compoundVariants: [
    {
      variant: 'link',
      class: 'h-auto min-h-0 px-0 py-0',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
const buttonTextStyle = tva({
  base: 'font-body font-semibold web:select-none',
  parentVariants: {
    variant: {
      default: 'text-typography-0',
      solid: 'text-typography-0',
      secondary: 'text-typography-0',
      destructive: 'text-typography-0',
      outline: 'text-primary-600 data-[active=true]:text-primary-700',
      ghost: 'text-typography-900',
      link: 'text-primary-600 data-[hover=true]:underline data-[active=true]:underline',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-base',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      icon: 'text-sm',
    },
  },
});

const buttonSpinnerStyle = tva({
  base: '',
  parentVariants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5',
      icon: 'h-4 w-4',
    },
  },
});

const buttonIconStyle = tva({
  base: 'fill-none pointer-events-none shrink-0',
  parentVariants: {
    variant: {
      default: 'text-typography-0',
      solid: 'text-typography-0',
      secondary: 'text-typography-0',
      destructive: 'text-typography-0',
      outline: 'text-primary-600 data-[active=true]:text-primary-700',
      ghost: 'text-typography-900',
      link: 'text-primary-600',
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5',
      icon: 'h-4 w-4',
    },
  },
});
const buttonGroupStyle = tva({
  base: '',
  variants: {
    space: {
      'xs': 'gap-1',
      'sm': 'gap-2',
      'md': 'gap-3',
      'lg': 'gap-4',
      'xl': 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    isAttached: {
      true: 'gap-0',
    },
    flexDirection: {
      'row': 'flex-row',
      'column': 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
  },
});
type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  'context'
> &
  VariantProps<typeof buttonStyle> & { className?: string };
const Button = React.forwardRef<
  React.ElementRef<typeof UIButton>,
  IButtonProps
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const resolvedVariant = variant === 'solid' ? 'default' : variant;
  const resolvedSize = size === 'md' ? 'default' : size;

  return (
    <UIButton
      ref={ref}
      {...props}
      className={buttonStyle({ variant: resolvedVariant, size: resolvedSize, class: className })}
      context={{ variant: resolvedVariant, size: resolvedSize }}
    />
  );
});
type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };
const ButtonText = React.forwardRef<
  React.ElementRef<typeof UIButton.Text>,
  IButtonTextProps
>(({ className, size, ...props }, ref) => {
  const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
        },
        size,
        class: className,
      })}
    />
  );
});
const ButtonSpinner = React.forwardRef<
  React.ElementRef<typeof UIButton.Spinner>,
  React.ComponentPropsWithoutRef<typeof UIButton.Spinner>
>(({ className, size, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);
  return <UIButton.Spinner ref={ref} {...props} className={buttonSpinnerStyle({ parentVariants: { size: parentSize }, class: className, size })} />;
});
type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };
const ButtonIcon = React.forwardRef<
  React.ElementRef<typeof UIButton.Icon>,
  IButtonIcon
>(({ className, size, ...props }, ref) => {
  const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
  if (typeof size === 'number') {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});
type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;
const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof UIButton.Group>,
  IButtonGroupProps
>(
  (
    {
      className,
      space = 'md',
      isAttached = false,
      flexDirection = 'column',
      ...props
    },
    ref
  ) => {
    return (
      <UIButton.Group
        className={buttonGroupStyle({
          class: className,
          space,
          isAttached,
          flexDirection,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);
Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';
export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };

// @ts-nocheck
'use client';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

import { Svg } from 'react-native-svg';
const SCOPE = 'BADGE';

const badgeStyle = tva({
  base: 'flex-row items-center justify-center rounded-xs',
  variants: {
    action: {
      error: 'bg-red-100 border-red-500',
      warning: 'bg-yellow-100 border-yellow-500',
      success: 'bg-green-100 border-green-500',
      info: 'bg-primary-100 border-primary-500',
      muted: 'bg-warmGray-100 border-warmGray-400',
      gray: 'bg-warmGray-100 border-warmGray-400',
    },
    variant: {
      solid: '',
      outline: 'border',
    },
    size: {
      sm: 'px-2 py-0.5',
      md: 'px-2 py-0.5',
      lg: 'px-2 py-0.5',
    },
  },
  defaultVariants: {
    action: 'info',
    variant: 'solid',
    size: 'md',
  },
});

const badgeTextStyle = tva({
  base: 'uppercase',
  parentVariants: {
    action: {
      error: 'text-red-600',
      warning: 'text-yellow-600',
      success: 'text-green-500',
      info: 'text-primary-600',
      muted: 'text-secondary-600',
      gray: 'text-warmGray-500',
    },
    variant: {
      solid: '',
      outline: '',
    },
    size: {
      sm: 'text-2xs',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
});

const badgeIconStyle = tva({
  base: 'fill-none pointer-events-none',
  parentVariants: {
    action: {
      error: 'text-red-600',
      warning: 'text-yellow-600',
      success: 'text-green-500',
      info: 'text-primary-600',
      muted: 'text-secondary-600',
      gray: 'text-warmGray-500',
    },
    variant: {
      solid: '',
      outline: '',
    },
    size: {
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    },
  },
});

const ContextView = withStyleContext(View, SCOPE);

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

type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> &
  VariantProps<typeof badgeStyle>;
function Badge({
  children,
  action = 'info',
  variant = 'solid',
  size = 'md',
  className,
  ...props
}: { className?: string } & IBadgeProps) {
  return (
    <ContextView
      className={badgeStyle({ action, variant, size, class: className })}
      {...props}
      context={{ action, variant, size }}
    >
      {children}
    </ContextView>
  );
}

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof badgeTextStyle>;

const BadgeText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IBadgeTextProps
>(function BadgeText({ children, className, ...props }, ref) {
  const { action: parentAction, variant: parentVariant, size: parentSize } =
    useStyleContext(SCOPE) ?? {};
  return (
    <Text
      ref={ref}
      className={badgeTextStyle({
        parentVariants: {
          action: parentAction,
          variant: parentVariant,
          size: parentSize,
        },
        class: className,
      })}
      {...props}
    >
      {children}
    </Text>
  );
});

type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof UIIcon> &
  VariantProps<typeof badgeIconStyle> & {
    size?: number;
  };

const BadgeIcon = React.forwardRef<
  React.ComponentRef<typeof Svg>,
  IBadgeIconProps
>(function BadgeIcon({ className, size, ...props }, ref) {
  const {
    action: parentAction,
    variant: parentVariant,
    size: parentSize,
  } = useStyleContext(SCOPE) ?? {};

  if (typeof size === 'number') {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props?.height !== undefined || props?.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIIcon
      className={badgeIconStyle({
        parentVariants: {
          action: parentAction,
          variant: parentVariant,
          size: parentSize,
        },
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';
BadgeIcon.displayName = 'BadgeIcon';

export { Badge, BadgeIcon, BadgeText };
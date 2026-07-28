// @ts-nocheck
'use client';
import React from 'react';
import { createFab } from '@gluestack-ui/core/fab/creator';
import { Pressable, Text } from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { UIIcon } from '@gluestack-ui/core/icon/creator';

const SCOPE = 'FAB';
const Root = withStyleContext(Pressable, SCOPE);
const UIFab = createFab({
  Root: Root,
  Label: Text,
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

const fabStyle = tva({
  base: 'group/fab bg-primary-500 rounded-full z-20 p-4 flex-row items-center justify-center absolute data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:web:pointer-events-auto data-[disabled=true]:web:cursor-not-allowed data-[focus=true]:web:outline-none data-[focus-visible=true]:web:outline data-[focus-visible=true]:web:outline-2 data-[focus-visible=true]:web:outline-primary-700 shadow-hard-2',
  variants: {
    size: {
      sm: 'px-2.5 py-2.5',
      md: 'px-3 py-3',
      lg: 'px-4 py-4',
    },
    placement: {
      'top right': 'top-4 right-4',
      'top left': 'top-4 left-4',
      'bottom right': 'bottom-4 right-4',
      'bottom left': 'bottom-4 left-4',
      'top center': 'top-4 self-center',
      'bottom center': 'bottom-4 self-center',
    },
  },
});

const fabLabelStyle = tva({
  base: 'text-typography-0 font-normal font-body tracking-md text-left mx-2',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    sub: {
      true: 'text-xs',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
  },
  parentVariants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
});

const fabIconStyle = tva({
  base: 'text-typography-0 fill-none',
  variants: {
    size: {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-4 w-4',
    },
  },
  parentVariants: {
    size: {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-4 w-4',
    },
  },
});

type IFabProps = Omit<React.ComponentPropsWithoutRef<typeof UIFab>, 'context'> &
  VariantProps<typeof fabStyle>;

const Fab = React.forwardRef<React.ComponentRef<typeof UIFab>, IFabProps>(
  function Fab(
    { size = 'md', placement = 'bottom right', className, ...props },
    ref
  ) {
    return (
      <UIFab
        ref={ref}
        {...props}
        className={fabStyle({ size, placement, class: className })}
        context={{ size }}
      />
    );
  }
);

type IFabLabelProps = React.ComponentPropsWithoutRef<typeof UIFab.Label> &
  VariantProps<typeof fabLabelStyle>;

const FabLabel = React.forwardRef<
  React.ComponentRef<typeof UIFab.Label>,
  IFabLabelProps
>(function FabLabel(
  {
    size,
    isTruncated = false,
    bold = false,
    underline = false,
    strikeThrough = false,
    className,
    ...props
  },
  ref
) {
  const { size: parentSize } = useStyleContext(SCOPE);
  return (
    <UIFab.Label
      ref={ref}
      {...props}
      className={fabLabelStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        class: className,
      })}
    />
  );
});

type IFabIconProps = React.ComponentPropsWithoutRef<typeof UIFab.Icon> &
  VariantProps<typeof fabIconStyle> & {
    height?: number;
    width?: number;
  };

const FabIcon = React.forwardRef<
  React.ComponentRef<typeof UIFab.Icon>,
  IFabIconProps
>(function FabIcon({ size, className, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIFab.Icon
        ref={ref}
        {...props}
        className={fabIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIFab.Icon
        ref={ref}
        {...props}
        className={fabIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIFab.Icon
      ref={ref}
      {...props}
      className={fabIconStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  );
});

Fab.displayName = 'Fab';
FabLabel.displayName = 'FabLabel';
FabIcon.displayName = 'FabIcon';

export { Fab, FabLabel, FabIcon };

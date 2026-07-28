// @ts-nocheck
'use client';

import React from 'react';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { createSelect } from '@gluestack-ui/core/select/creator';
import { cssInterop } from 'nativewind';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetScrollView,
  ActionsheetVirtualizedList,
  ActionsheetFlatList,
  ActionsheetSectionList,
  ActionsheetSectionHeaderText,
} from './select-actionsheet';
import { Pressable, View, TextInput } from 'react-native';

const SelectTriggerWrapper = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>(function SelectTriggerWrapper({ ...props }, ref) {
  return <Pressable {...props} ref={ref} />;
});

const selectIconStyle = tva({
  base: 'text-typography-400 fill-none',
  parentVariants: {
    size: {
      '2xs': 'h-3 w-3',
      'xs': 'h-3.5 w-3.5',
      'sm': 'h-4 w-4',
      'md': 'h-[18px] w-[18px]',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
    },
  },
});

const selectStyle = tva({
  base: '',
});

const selectTriggerStyle = tva({
  base: 'w-full border border-backgroundLight-300 rounded flex-row items-center overflow-hidden bg-transparent data-[hover=true]:border-borderLight-400 data-[focus=true]:border-primary-700 data-[focus=true]:data-[hover=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:data-[hover=true]:border-backgroundLight-300 data-[invalid=true]:border-error-700 data-[invalid=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700',
  variants: {
    size: {
      xl: 'h-12',
      lg: 'h-11',
      md: 'h-10',
      sm: 'h-9',
    },
    variant: {
      underlined:
        'border-0 border-b border-backgroundLight-300 rounded-none data-[focus=true]:border-primary-700 data-[invalid=true]:border-b-2 data-[invalid=true]:border-error-700',
      outline: '',
      rounded: 'rounded-full',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
});

const selectInputStyle = tva({
  base: 'flex-1 px-3 placeholder:text-typography-500 web:w-full h-full text-typography-900 font-body pointer-events-none web:outline-none ios:leading-[0px] py-0',
  parentVariants: {
    size: {
      xl: 'text-xl',
      lg: 'text-lg',
      md: 'text-base',
      sm: 'text-sm',
    },
    variant: {
      underlined: 'px-0',
      outline: '',
      rounded: 'px-4',
    },
  },
});

const UISelect = createSelect(
  {
    Root: View,
    Trigger: withStyleContext(SelectTriggerWrapper),
    Input: TextInput,
    Icon: UIIcon,
  },
  {
    Portal: Actionsheet,
    Backdrop: ActionsheetBackdrop,
    Content: ActionsheetContent,
    DragIndicator: ActionsheetDragIndicator,
    DragIndicatorWrapper: ActionsheetDragIndicatorWrapper,
    Item: ActionsheetItem,
    ItemText: ActionsheetItemText,
    ScrollView: ActionsheetScrollView,
    VirtualizedList: ActionsheetVirtualizedList,
    FlatList: ActionsheetFlatList,
    SectionList: ActionsheetSectionList,
    SectionHeaderText: ActionsheetSectionHeaderText,
  }
);

cssInterop(UISelect, { className: 'style' });
cssInterop(UISelect.Input, {
  className: { target: 'style', nativeStyleToProp: { textAlign: true } },
});
cssInterop(SelectTriggerWrapper, { className: 'style' });

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

type ISelectProps = VariantProps<typeof selectStyle> &
  React.ComponentProps<typeof UISelect> & { className?: string };

const Select = React.forwardRef<
  React.ComponentRef<typeof UISelect>,
  ISelectProps
>(function Select({ className, ...props }, ref) {
  return (
    <UISelect
      className={selectStyle({
        class: className,
      })}
      ref={ref}
      {...props}
    />
  );
});

type ISelectTriggerProps = VariantProps<typeof selectTriggerStyle> &
  React.ComponentProps<typeof UISelect.Trigger> & { className?: string };

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof UISelect.Trigger>,
  ISelectTriggerProps
>(function SelectTrigger(
  { className, size = 'md', variant = 'outline', ...props },
  ref
) {
  return (
    <UISelect.Trigger
      className={selectTriggerStyle({
        class: className,
        size,
        variant,
      })}
      ref={ref}
      context={{ size, variant }}
      {...props}
    />
  );
});

type ISelectInputProps = VariantProps<typeof selectInputStyle> &
  React.ComponentProps<typeof UISelect.Input> & { className?: string };

const SelectInput = React.forwardRef<
  React.ComponentRef<typeof UISelect.Input>,
  ISelectInputProps
>(function SelectInput({ className, ...props }, ref) {
  const { size: parentSize, variant: parentVariant } = useStyleContext();
  return (
    <UISelect.Input
      className={selectInputStyle({
        class: className,
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
        },
      })}
      ref={ref}
      {...props}
    />
  );
});

type ISelectIcon = VariantProps<typeof selectIconStyle> &
  React.ComponentProps<typeof UISelect.Icon> & { className?: string };

const SelectIcon = React.forwardRef<
  React.ComponentRef<typeof UISelect.Icon>,
  ISelectIcon
>(function SelectIcon({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext();
  if (typeof size === 'number') {
    return (
      <UISelect.Icon
        ref={ref}
        {...props}
        className={selectIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    //@ts-expect-error : web only
    (props?.height !== undefined || props?.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UISelect.Icon
        ref={ref}
        {...props}
        className={selectIconStyle({ class: className })}
      />
    );
  }
  return (
    <UISelect.Icon
      className={selectIconStyle({
        class: className,
        size,
        parentVariants: {
          size: parentSize,
        },
      })}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectInput.displayName = 'SelectInput';
SelectIcon.displayName = 'SelectIcon';

// Actionsheet Components
const SelectPortal = UISelect.Portal;
const SelectBackdrop = UISelect.Backdrop;
const SelectContent = UISelect.Content;
const SelectDragIndicator = UISelect.DragIndicator;
const SelectDragIndicatorWrapper = UISelect.DragIndicatorWrapper;
const SelectItem = UISelect.Item;
const SelectScrollView = UISelect.ScrollView;
const SelectVirtualizedList = UISelect.VirtualizedList;
const SelectFlatList = UISelect.FlatList;
const SelectSectionList = UISelect.SectionList;
const SelectSectionHeaderText = UISelect.SectionHeaderText;

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
};

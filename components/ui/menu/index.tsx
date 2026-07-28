// @ts-nocheck
"use client";
import { createMenu } from "@gluestack-ui/core/menu/creator";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { cssInterop } from "nativewind";
import React from "react";
import { Platform, Pressable, Text, View, ViewStyle } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

const menuShadowStyle: ViewStyle = Platform.select({
  ios: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  android: {
    elevation: 12,
    shadowColor: "#8C8C8C",
  },
  default: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
})!;

const menuStyle = tva({
  base: "rounded-sm bg-white",
});

const menuItemStyle = tva({
  base: "w-full p-3 flex-row items-center rounded data-[hover=true]:bg-backgroundLight-100 data-[active=true]:bg-backgroundLight-200 data-[focus=true]:bg-backgroundLight-100 data-[focus=true]:web:outline-none data-[focus=true]:web:outline-0 data-[disabled=true]:opacity-40 data-[disabled=true]:web:cursor-not-allowed data-[disabled=true]:data-[focus=true]:bg-transparent",
});

const menuBackdropStyle = tva({
  base: "absolute top-0 bottom-0 left-0 right-0 web:cursor-default",
});

const menuSeparatorStyle = tva({
  base: "bg-backgroundLight-200 h-px w-full",
});

const menuItemLabelStyle = tva({
  base: "text-typography-900 font-normal font-body",

  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-bold",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500",
    },
  },
});

const BackdropPressable = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> &
    VariantProps<typeof menuBackdropStyle>
>(function BackdropPressable({ className, ...props }, ref) {
  return (
    <Pressable
      ref={ref}
      className={menuBackdropStyle({
        class: className,
      })}
      {...props}
    />
  );
});

type IMenuItemProps = VariantProps<typeof menuItemStyle> & {
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Item = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  IMenuItemProps
>(function Item({ className, ...props }, ref) {
  return (
    <Pressable
      ref={ref}
      className={menuItemStyle({
        class: className,
      })}
      {...props}
    />
  );
});

const Separator = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof menuSeparatorStyle>
>(function Separator({ className, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={menuSeparatorStyle({ class: className })}
      {...props}
    />
  );
});

cssInterop(AnimatedView, { className: "style" });

export const UIMenu = createMenu({
  Root: AnimatedView,
  Item: Item,
  Label: Text,
  Backdrop: BackdropPressable,
  Separator: Separator,
});

type IMenuProps = React.ComponentProps<typeof UIMenu> &
  VariantProps<typeof menuStyle> & { className?: string };
type IMenuItemLabelProps = React.ComponentProps<typeof UIMenu.ItemLabel> &
  VariantProps<typeof menuItemLabelStyle> & { className?: string };

const Menu = React.forwardRef<React.ComponentRef<typeof UIMenu>, IMenuProps>(
  function Menu({ className, style, ...props }, ref) {
    return (
      <UIMenu
        entering={ZoomIn.duration(150).withInitialValues({
          transform: [{ scale: 0.9 }],
          opacity: 0,
        })}
        exiting={FadeOut.duration(150)}
        ref={ref}
        className={menuStyle({
          class: className,
        })}
        style={[
          {
            width: 260,
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
            paddingVertical: 8,
          },
          menuShadowStyle,
          style,
        ]}
        {...props}
      />
    );
  },
);

const MenuItem = UIMenu.Item;

const MenuItemLabel = React.forwardRef<
  React.ComponentRef<typeof UIMenu.ItemLabel>,
  IMenuItemLabelProps
>(function MenuItemLabel(
  {
    className,
    isTruncated,
    bold,
    underline,
    strikeThrough,
    sub,
    italic,
    highlight,
    ...props
  },
  ref,
) {
  return (
    <UIMenu.ItemLabel
      ref={ref}
      className={menuItemLabelStyle({
        isTruncated: isTruncated as boolean,
        bold: bold as boolean,
        underline: underline as boolean,
        strikeThrough: strikeThrough as boolean,
        sub: sub as boolean,
        italic: italic as boolean,
        highlight: highlight as boolean,
        class: className,
      })}
      {...props}
    />
  );
});

const MenuSeparator = UIMenu.Separator;

Menu.displayName = "Menu";
MenuItem.displayName = "MenuItem";
MenuItemLabel.displayName = "MenuItemLabel";
MenuSeparator.displayName = "MenuSeparator";
export { Menu, MenuItem, MenuItemLabel, MenuSeparator };

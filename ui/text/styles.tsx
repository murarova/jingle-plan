// @ts-nocheck
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';

const baseStyle = isWeb
  ? 'font-body tracking-sm my-0 bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word'
  : 'ios:font-system android:font-roboto';

export const textStyle = tva({
  base: `text-primaryText font-normal tracking-md ${baseStyle}`,

  variants: {
    isTruncated: {
      true: 'web:truncate',
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
      '2xs': 'ios:text-[11px] ios:leading-[14px] android:text-[10px] android:leading-[14px]',
      xs: 'ios:text-[13px] ios:leading-[18px] android:text-[12px] android:leading-[16px]',
      sm: 'ios:text-[15px] ios:leading-[20px] android:text-[14px] android:leading-[20px]',
      md: 'ios:text-[17px] ios:leading-[22px] android:text-[16px] android:leading-[24px]',
      lg: 'ios:text-[18px] ios:leading-[24px] android:text-[18px] android:leading-[26px]',
      xl: 'ios:text-[20px] ios:leading-[25px] android:text-[20px] android:leading-[26px]',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
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
});

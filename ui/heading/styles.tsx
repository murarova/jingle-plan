// @ts-nocheck
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';
const baseStyle = isWeb
  ? 'font-heading tracking-sm bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word'
  : 'ios:font-system android:font-roboto ios:font-semibold android:font-medium';

export const headingStyle = tva({
  base: `text-primaryText tracking-sm my-0 ${baseStyle}`,
  variants: {
    isTruncated: {
      true: 'truncate',
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
    sub: {
      true: 'text-xs',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
    size: {
      '5xl': 'text-6xl',
      '4xl': 'text-5xl',
      '3xl': 'text-4xl',
      '2xl': 'text-3xl',
      xl: 'ios:text-[22px] ios:leading-[28px] android:text-[22px] android:leading-[28px]',
      lg: 'ios:text-[20px] ios:leading-[25px] android:text-[20px] android:leading-[26px]',
      md: 'ios:text-[17px] ios:leading-[22px] android:text-[16px] android:leading-[24px]',
      sm: 'ios:text-[15px] ios:leading-[20px] android:text-[14px] android:leading-[20px]',
      xs: 'ios:text-[13px] ios:leading-[18px] android:text-[12px] android:leading-[16px]',
    },
  },
});

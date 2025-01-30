import { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { styledTv } from '../../utils/styledTv'

const buttonVariants = tv({
  base: 'text-zinc-400 rounded-lg cursor-pointer hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none',
  variants: {
    size: {
      default: 'px-3 py-2',
      icon: 'p-2',
      'icon-sm': 'p-1'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

export const Button = ({
  size,
  className,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) => {
  return <button className={buttonVariants({ size, className })} {...props} />
}

// Test styledTv
export const StyledButton = styledTv('button', {
  base: 'text-zinc-400 rounded-lg hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none',
  variants: {
    size: {
      default: 'px-3 py-2',
      icon: 'p-2',
      'icon-sm': 'p-1'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

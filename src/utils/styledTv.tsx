import React, { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'

// Get the type of the parameter of the tv function
type TVFunctionParameter = Parameters<typeof tv>[0]

// Get the type keys of variants
type TVVariantsKeys = keyof TVFunctionParameter['variants']

type TVVariantsValues = TVFunctionParameter['variants'][TVVariantsKeys]

// Define the type for all HTML elements
type HTMLElementKey = keyof JSX.IntrinsicElements

type Props = ComponentProps<HTMLElementKey> & {
  [key in TVVariantsKeys]?: TVVariantsValues
}

export const styledTv = (element: HTMLElementKey, tvDefinition: TVFunctionParameter) => {
  const tvClass = tv(tvDefinition)

  return ({ className, children, ...props }: Props) => {
    // get only the props of the variants
    const variantProps = Object.keys(props).filter(
      key => key in tvDefinition.variants
    ) as TVVariantsKeys[]

    const otherProps = Object.keys(props).filter(key => !(key in tvDefinition.variants))

    return React.createElement(
      element,
      {
        className: tvClass({ className, ...variantProps }),
        ...otherProps
      },
      children
    )
  }
}

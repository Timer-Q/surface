import React, { createContext } from 'react'
import Radio from './Radio'
import RadioButton from './RadioButton'

export const { Provider, Consumer } = createContext()

export const RadioWithConsumer = props => {
  return (
    <Consumer>
      {context => {
        return <Radio {...props} {...context} />
      }}
    </Consumer>
  )
}

export const RadioButtonWithConsumer = props => {
  return (
    <Consumer>
      {context => {
        return <RadioButton {...context} {...props} />
      }}
    </Consumer>
  )
}

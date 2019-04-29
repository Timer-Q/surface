import React from 'react'
import TableHeader from './TableHeader'
import TableBody from './TableBody'

export const { Provider, Consumer } = React.createContext()

export const TableHeaderWithConsumer = props => {
  return (
    <Consumer>
      {context => {
        return <TableHeader {...context} {...props} />
      }}
    </Consumer>
  )
}

export const TableBodyWithConsumer = props => {
  return (
    <Consumer>
      {context => {
        return <TableBody {...props} {...context} />
      }}
    </Consumer>
  )
}

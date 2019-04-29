import React from 'react'
import { Switch, HashRouter, Route } from 'react-router-dom'
import Page from '../demos'

const Routers = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" component={Page} />
      </Switch>
    </HashRouter>
  )
}

export default Routers

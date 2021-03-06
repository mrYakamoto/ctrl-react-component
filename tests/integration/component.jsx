jest.mock('socket.io-client', () => {
  return jest.fn(() => {
    return {
      on: jest.fn(() => {})
    }
  })
})

import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'ctrl-react-router'
import {Client} from 'ctrl-react-web-socket'
import TestUtils from 'react-addons-test-utils'

import {checkChild} from '../lib/utilities'

import CtrlComponent from '../../ctrl-react-component'

const CONTENT = {
  globalElements: {
    nav: [
      {
        label: 'Home'
      , href: '/'
      }
    , {
        label: 'About'
      , href: '/about'
      }
    , {
        label: 'Products'
      , href: '/products'
      }
    ]
  }
, pages: {
    'home': {
      'header': 'Welcome'
    , 'body': 'Hello, world!'
    }
  , 'about': {
      'header': 'About Us'
    , 'body': 'Built in ATX!'
    }
  }
}

class Page extends CtrlComponent {
  renderFiltered() {
    return (
      <section>
        <h1>{this.getContent('header')}</h1>
        <p>{this.getContent('body')}</p>
      </section>
    )
  }
}

class HomePage extends Page {}
class AboutPage extends Page {}

class Nav extends CtrlComponent {
  renderFiltered() {
    const items = this.getContent().map((item, index) => {
      return (
        <li key={index}>
          <a href={item.href}>{item.label}</a>
        </li>
      )
    })

    return (
      <nav>
        <ul>
          {items}
        </ul>
        <CtrlComponent
          routeFilter={(route, query) => query.loggedIn === 'true'}
        >
          <div ref='loggedIn'/>
        </CtrlComponent>
      </nav>
    )
  }
}

class SingleChildPermanent extends CtrlComponent {
  renderFiltered() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

class SingleChildHome extends CtrlComponent {
  renderFiltered() {
    return (
      <div>{this.props.children}</div>
    )
  }
}

class ChildTest extends CtrlComponent {
  renderFiltered() {
    return (
      <div/>
    )
  }
}

class Container extends CtrlComponent {
  renderFiltered() {
    return (
      <div>
        <Nav
          content={this.getContent('globalElements.nav')}
        />
        <HomePage
          content={this.getContent('pages.home')}
          routeFilter={(route) => route.length === 0}
        />
        <AboutPage
          content={this.getContent('pages.about')}
          routeFilter={(route) => route[0] === 'about'}
        />
        <SingleChildPermanent content={null}>
          <ChildTest
            content={null}
            routeFilter={(route) => route.length === 0}
          />
        </SingleChildPermanent>
        <SingleChildHome
          content={null}
          routeFilter={(route) => route.length === 0}
        >
          <ChildTest
            content={null}
            routeFilter={(route) => route.length === 1}
          />
        </SingleChildHome>
      </div>
    )
  }
}

let client
let router

beforeEach(() => {
  client = TestUtils.renderIntoDocument(
    <Client url='http://localhost'>
      <Router>
        <Container content={CONTENT}/>
      </Router>
    </Client>
  )

  router = TestUtils.findRenderedComponentWithType(
    client
  , Router
  )
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(client.refs.node.parentNode)
})

test('should render components', () => {
  checkChild(client, Nav, true, (nav) => {
    expect(nav.refs.loggedIn).toBeUndefined()
  })
  checkChild(client, HomePage)
  checkChild(client, AboutPage, false)
  checkChild(client, SingleChildPermanent, true, (single) => {
    checkChild(single, ChildTest)
  })
  checkChild(client, SingleChildHome, true, (single) => {
    checkChild(single, ChildTest, false)
  })
})

test('should render components', () => {
  router.updateRoute('/about')
  
  checkChild(client, Nav, true, (nav) => {
    expect(nav.refs.loggedIn).toBeUndefined()
  })
  checkChild(client, HomePage, false)
  checkChild(client, AboutPage)
  checkChild(client, SingleChildPermanent, true, (single) => {
    checkChild(single, ChildTest, false)
  })
  checkChild(client, SingleChildHome, false)
})

test('should render logged in components', () => {
  router.updateRoute('/about?loggedIn=true')
  
  checkChild(client, Nav, true, (nav) => {
    expect(nav.refs.loggedIn).toBeDefined()
  })
  checkChild(client, HomePage, false)
  checkChild(client, AboutPage)
  checkChild(client, SingleChildPermanent, true, (single) => {
    checkChild(single, ChildTest, false)
  })
  checkChild(client, SingleChildHome, false)
})

import TestUtils from 'react-addons-test-utils'

export function checkChild(container, type, isRendered = true, extraTest) {
  const children = TestUtils.scryRenderedComponentsWithType(
    container
  , type
  )

  const test = expect(children.length === 1)

  if (!isRendered) {
    test.toBeFalsy()
    return
  }

  test.toBeTruthy()

  const child = children[0]
  expect(child).toBeDefined()

  expect(typeof child.getContent).toBe('function')

  const props = child.props
  expect(typeof props.content).toBe('object')

  const context = child.context
  expect(typeof context.router).toBe('object')
  expect(Array.isArray(context.router.route)).toBeTruthy()
  expect(typeof context.router.query).toBe('object')
  expect(typeof context.router.updateRoute).toBe('function')
  expect(typeof context.router.filterChildren).toBe('function')

  expect(typeof context.webSocket).toBe('object')
  expect(typeof context.webSocket.emit).toBe('function')
  expect(context.webSocket.isConnected).toBe(false)

  extraTest && extraTest(child)
}

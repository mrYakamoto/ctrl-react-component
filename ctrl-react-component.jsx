import ContentConsumer from 'ctrl-react-content-consumer'
import debug from 'debug'

import processTree from './lib/process-tree'
import render from './lib/render'

import * as propTypes from './lib/prop-types'
import * as contextTypes from './lib/context-types'

class CtrlReactComponent extends ContentConsumer {
  constructor(props) {
    super(props)

    this.log = props.log || debug('ctrl:component')

    this.processTree = this.processTree.bind(this)
  }

  static propTypes = propTypes
  static contextTypes = contextTypes
}

// Methods
const proto = CtrlReactComponent.prototype

proto.processTree = processTree
proto.render = render

export default CtrlReactComponent

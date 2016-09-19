import React from 'react'

export default function render() {
  const tree = this.renderFiltered
    ? this.renderFiltered()
    : <div ref='node'>{this.props.children}</div>

  const processedTree = this.processTree(tree)

  return processedTree
}

import React from 'react'

export default function processTree(tree) {
  if (
     tree.props
  && tree.props.routeFilter
  && !this.context.router.filterChildren(tree)
  ) {
    return
  }

  const children = tree.props && tree.props.children

  if (this.context.router.filterChildren(tree)) {
    if (Array.isArray(children)) {
      return React.cloneElement(tree, {
        children: React.Children
          .map(children, this.processTree)
          .filter(this.context.router.filterChildren)
      })
    }

    return tree
  }
}

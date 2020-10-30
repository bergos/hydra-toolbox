import clownface from 'clownface'
import Router from 'generic-router'
import TermSet from '@rdfjs/term-set'
import ns from './namespaces.js'
import URL from './URL.js'

class RoutingResourceLoader {
  constructor ({ basePath = '' } = {}) {
    this.basePath = basePath
    this.router = new Router()
  }

  path (path, callback) {
    this.router.path(this.basePath + path, callback)
  }

  resource (path, callback) {
    this.router.resource(this.basePath + path, callback)
  }

  async load (term) {
    let { dataset, types, ...others } = (await this.router.handle(new URL(term).pathname, { term })) || {}

    if (!dataset || dataset.size === 0) {
      return null
    }

    if (!types) {
      types = new TermSet(clownface({ dataset, term }).out(ns.rdf.type).terms)
    }

    return {
      term,
      dataset,
      types,
      ...others
    }
  }

  async forClassOperation (term) {
    const resource = await this.load(term)

    return resource ? [resource] : []
  }

  async forPropertyOperation (term) {
    return []
  }
}

export default RoutingResourceLoader

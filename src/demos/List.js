import Markdown from 'components/utils/markdown'

export default class Layout extends Markdown {
  document() {
    return require('components/List/README.md')
  }
}
import Markdown from 'components/utils/markdown'

export default class Tree extends Markdown {
  document() {
    return require('components/Tree/README.md')
  }
}

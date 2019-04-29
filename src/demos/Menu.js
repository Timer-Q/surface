import Markdown from 'components/utils/markdown'

export default class Menu extends Markdown {
  document() {
    return require('components/Menu/README.md')
  }
}
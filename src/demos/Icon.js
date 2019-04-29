import Markdown from 'components/utils/markdown'

export default class Icon extends Markdown {
  document() {
    return require('components/Icon/README.md')
  }
}
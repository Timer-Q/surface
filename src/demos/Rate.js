import Markdown from 'components/utils/markdown'

export default class Rate extends Markdown {
  document() {
    return require('components/Rate/README.md')
  }
}
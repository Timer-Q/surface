import Markdown from 'components/utils/markdown'


export default class Card extends Markdown {
  document() {
    return require('components/Card/README.md')
  }
}

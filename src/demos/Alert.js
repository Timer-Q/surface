import Markdown from 'components/utils/markdown'


export default class Alert extends Markdown {
  document() {
    return require('components/Alert/README.md')
  }
}

import Markdown from 'components/utils/markdown'

export default class Table extends Markdown {
  document() {
    return require('components/Table/README.md')
  }
}

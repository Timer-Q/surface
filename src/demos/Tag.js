import Markdown from 'components/utils/markdown'


export default class Tag extends Markdown {
  document() {
    return require('components/Tag/README.md')
  }
}

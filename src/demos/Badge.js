import Markdown from 'components/utils/markdown'


export default class Badge extends Markdown {
  document() {
    return require('components/Badge/README.md')
  }
}

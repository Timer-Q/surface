import Markdown from 'components/utils/markdown'

export default class Upload extends Markdown {
  document() {
    return require('components/Upload/README.md')
  }
}
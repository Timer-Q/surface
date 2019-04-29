import Markdown from 'components/utils/markdown'

export default class Notification extends Markdown {
  document() {
    return require('components/Notification/README.md')
  }
}
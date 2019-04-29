import Markdown from 'components/utils/markdown'

export default class Message extends Markdown {
  document() {
    return require('components/Message/README.md')
  }
}

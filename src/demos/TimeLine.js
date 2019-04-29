import Markdown from 'components/utils/markdown'

export default class TimeLine extends Markdown {
  document() {
    return require('components/TimeLine/README.md')
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'components'

export default class EditableCell extends Component {
  static propTypes = {
    editable: PropTypes.bool,
    record: PropTypes.array,
    handleSave: PropTypes.func,
    dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    columnKey: PropTypes.string,
    row: PropTypes.object,
    column: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      value: props.row ? props.row[props.columnKey] : undefined,
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { row, columnKey } = nextProps
  //   if (row) {
  //     return {
  //       value: prevState.value || row[columnKey]
  //     }
  //   }
  //   return null
  // }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing })
  }

  handleClickOutside = e => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save()
    }
  }

  save = () => {
    const { row, columnKey, handleSave } = this.props
    const { value } = this.state
    this.toggleEdit()
    row[columnKey] = value
    handleSave(row)
  }

  handleChange = value => {
    this.setState({
      value,
    })
  }

  render() {
    const { editing, value } = this.state
    const { editable, columnKey, row } = this.props
    return (
      <div ref={node => (this.cell = node)}>
        {editable ? (
          editing ? (
            <Input
              size="small"
              value={value}
              ref={node => (this.input = node)}
              onChange={this.handleChange}
              onPressEnter={this.save}
            />
          ) : (
            <div
              className="editable-cell-value-wrap"
              style={{ paddingRight: 24 }}
              onClick={this.toggleEdit}>
              {row[columnKey]}
            </div>
          )
        ) : (
          row[columnKey]
        )}
      </div>
    )
  }
}

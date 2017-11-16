// import './css/TextBox.less'
import React from 'react'
import { HotKeys } from 'react-hotkeys'
import PropTypes from 'prop-types'

var MASK_REGEX = {
  '9': /\d/,
  A: /[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,
  '*': /[\dA-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,
}

var MASK_CHARS = Object.keys(MASK_REGEX)
var PTRN_REGEX = new RegExp(`[${MASK_CHARS.join(',')}]`, 'g')

class TextBox extends React.Component {
  constructor(props) {
    super(props)
    const type = this.props.type === ('number' || 'integer')
      ? 'number'
      : 'text'
    this.state = { type: type }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isEditing && !prevProps.isEditing) {
      this.refTextBox.focus()
      this.refTextBox.setSelectionRange(this.mask.cursor, this.mask.cursor)
      if (
        typeof prevProps.userTypedText !== 'undefined' &&
        prevProps.userTypedText !== null
      ) {
        this.processValue(prevProps.userTypedText, this.props.isEditing)
      }
    }
    if (this.props.mask && this.props.isEditing) {
      this.refTextBox.focus()
      this.refTextBox.setSelectionRange(this.mask.cursor, this.mask.cursor)
    }
    // if (this.props.isEditing) {
    //   console.log('TextBoxFocus')
    //   this.refTextBox.focus()
    //   if (this.props.mask) {
    //     this.refTextBox.focus()
    //     this.refTextBox.setSelectionRange(this.mask.cursor, this.mask.cursor)
    //   }
    //   if (
    //     !prevProps.isEditing &&
    //     typeof prevProps.userTypedText !== 'undefined' &&
    //     prevProps.userTypedText !== null
    //   ) {
    //     this.processValue(prevProps.userTypedText, this.props.isEditing)
    //   }
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isEditing && !nextProps.isEditing && !nextProps.isFocus) {
      this.handleBlur()
    }
    if (
      this.props.isFocus &&
      typeof nextProps.userTypedText !== 'undefined' &&
      nextProps.userTypedText !== null
    ) {
      this.props.onEditCell()
    }
    this.processValue(nextProps.value, nextProps.isEditing)
  }

  componentWillMount() {
    // Calcula o pattern de visualização e define o regex de validação de cada caracter da mascara
    var pattern, mask, rexps
    if (this.props.mask) {
      mask = this.props.mask
      pattern = mask.replace(PTRN_REGEX, '_')
      rexps = {}
      mask.split('').forEach(function(c, i) {
        if (MASK_CHARS.indexOf(c) !== -1) {
          rexps[i + 1] = MASK_REGEX[c]
        }
      })
    }
    this.mask = {
      cursor: 0,
      pattern: pattern,
      mask: mask,
      rexps: rexps,
    }
    this.processValue(this.props.value, this.props.isEditing)
  }

  render() {
    const handlers = {
      stageChanges: this.onEnter,
      moveUp: this.onArrow,
      moveDown: this.onArrow,
      moveRight: this.onArrow,
      moveLeft: this.onArrow,
      exitEdit: this.onExitEdit,
    }
    var control = null
    const borderColor = this.props.hasError ? 'b--red' : 'b--blue'
    const formBorderColor = this.props.hasError ? 'b--red' : 'b--moon-gray'
    if (this.props.isEditing) {
      var error = null
      control = (
        <HotKeys
          handlers={handlers}
          className={
            this.props.renderType === 'cell'
              ? `flex items-center h-inherit z-3 w-100 bw1 bg-white ba ${
                borderColor}`
              : `w100 z-3 bw1 br3 pa2 ba ${formBorderColor}`
          }
        >
          <input
            className={'w-100 bn pl05'}
            type={this.state.type}
            value={this.state.maskedValue}
            ref={ref => {
              this.refTextBox = ref
            }}
            onChange={this.handleChange}
            onClick={this.handleInputClick}
            onBlur={this.handleBlur}
          />
          {error}
        </HotKeys>
      )
    } else {
      control = (
        <div
          className={
            `flex items-center w-100 h-inherit ${
              this.props.isFocus
                ? `bw1 ba ${borderColor} bg-lightest-blue pl05 `
                : this.props.hasError ? 'bw1 ba b--red pl05' : 'pl2'}`
          }
          onDoubleClick={this.handleEdit}
        >
          <div className={'truncate'}>
            {this.state.maskedValue}
          </div>
        </div>
      )
    }

    return control
  }

  processValue(initialValue, isEditing) {
    // o initialValue pode ser passado mascarado ou não, por isso são criadas duas variaves
    // newValue que contem o dado sem mascara e newMaskedValue que contem o valor mascaado
    var value = initialValue || ''
    var newValue = this.props.mask ? '' : value
    var newMaskedValue = this.props.mask ? '' : value
    var cursorMax = newValue.length

    if (this.props.mask && value) {
      var mask = this.mask.mask
      var cursorMin = 0
      var nextChar

      for (var i = 0, j = 0; i < mask.length;) {
        // Se o caracter estiver presente na mascara mas não esta na lista de caracteres validos
        // coloca o valor da mascara no valor
        if (MASK_CHARS.indexOf(mask[i]) === -1) {
          newMaskedValue += mask[i]
          if (mask[i] === value[j]) {
            j++
          }
          i++
        } else {
          nextChar = value.substr(j++, 1)
          if (cursorMin === 0) {
            cursorMin = i
          }
          if (nextChar) {
            if (this.mask.rexps[newMaskedValue.length + 1].test(nextChar)) {
              newMaskedValue += nextChar
              newValue += nextChar
              cursorMax = newMaskedValue.length
              i++
            }
          } else {
            newMaskedValue = newMaskedValue.substr(0, cursorMax)
            if (isEditing) {
              newMaskedValue += this.mask.pattern.slice(cursorMax)
            }
            break
          }
        }
      }
      cursorMax = Math.max(cursorMax, cursorMin)
    }
    this.setState({ maskedValue: newMaskedValue, value: newValue })
    this.mask.cursor = cursorMax
  }

  handleBlur = () => {
    console.log('textBoxBlur')
    if (!this.state.value && !this.props.value) return
    if (this.props.value !== this.state.value) {
      const value = this.props.type === 'integer' ||
        this.props.type === 'number'
        ? Number(this.state.value)
        : this.state.value
      this.props.setChange(value)
    }
  };

  handleEdit = ev => {
    this.props.onEditCell(ev)
  };

  handleChange = e => {
    this.processValue(e.target.value, this.props.isEditing)
  };

  onEnter = () => {
    if (this.props.isEditing) {
      this.handleBlur()
      if (this.props.onExitEditCell) {
        this.props.onExitEditCell(this.props.cell)
      }
    }
  };

  handleInputClick = () => {
    this.refTextBox.focus()
  };

  onExitEdit = () => {
    this.setState({ value: this.props.value })
    if (this.props.onExitEditCell) {
      this.props.onExitEditCell(this.props.cell)
    }
  };

  onArrow = () => {};
}

TextBox.propTypes = {
  hasError: PropTypes.bool,
  renderType: PropTypes.string,
  errorMessage: PropTypes.string,
  userTypedText: PropTypes.string,
  mask: PropTypes.string,
  isFocus: PropTypes.bool,
  isEditing: PropTypes.bool,
  value: PropTypes.any,
  onExitEditCell: PropTypes.func,
  onEditCell: PropTypes.func,
  onExitEdit: PropTypes.func,
  setChange: PropTypes.func,
  cell: PropTypes.object,
  type: PropTypes.string,
}

TextBox.defaultProps = {
  value: '',
}

export default TextBox

import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
// import Store from '../../stores/SavingStore'

class SaveButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isSaving: false }
  }
  componentDidMount() {
    // this.unsubscribe = Store.listen(this.onStoreChange)
  }

  componentWillUnmount() {
    // this.unsubscribe()
  }

  render() {
    const textKey = this.state.isSaving
      ? 'FixedToolbar.saving'
      : 'FixedToolbar.save'
    return (
      <div
        className={`pv2 br3 ph2 inline-flex nowrap ${
          this.props.disabled || this.state.isSaving
            ? 'cursor-not-allowed o-30 '
            : 'pointer'
        }`}
        onClick={() => {
          if (this.props.disabled || this.state.isSaving) {
            return
          }
          this.handleClick()
        }}
      >
        <i className="fa fa-save pr2" />
        <div className="dn di-l">
          <FormattedMessage id={textKey} />
        </div>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ disabled: nextProps.disabled })
  }

  onStoreChange = () => {
    // const store = Store.get()
    // this.setState({
    // isSaving: store.isSaving,
    // })
  }

  handleClick = () => {
    if (this.props.disabled || this.state.isSaving) {
      return
    }
    this.props.onClick()
  }
}

SaveButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default SaveButton

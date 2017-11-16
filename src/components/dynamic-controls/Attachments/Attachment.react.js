import React from 'react'
import PropTypes from 'prop-types'

class Attachment extends React.Component {
  render() {
    return (
      <div
        key={`modalAtt-${this.props.index}`}
        className={
          `editing-mode relative h5 w5 mh3 mb3 ba br2 tc dim bw-1 br3 b--moon-gray pointer pa1${
            this.props.selectedItem !== null &&
              this.props.selectedItem === this.props.index
              ? ' shadow-1'
              : ''}`
        }
      >
        <i
          key={`att-icon-trash-${this.props.index}`}
          title="delete backspace"
          className={
            'dim absolute h2 w2 pt1 ma2 bg-black-90 white ba bw-1 bb-white br-100 right-2 attachment-icon-trash fa fa-trash-o'
          }
          onClick={this.handleRemove}
        />
        <i
          key={`att-icon-download${this.props.index}`}
          title="mod+s"
          className={
            'dim absolute h2 w2 pt1 ma2 bg-black-90 white ba bw-1 bb-white br-100 right-0 attachment-icon-download fa fa-download'
          }
          onClick={this.handleSaveToDisk}
        />
        <img
          key={`attachment-${this.props.index}`}
          className={'h-100'}
          src={this.props.item}
          alt={this.props.fileName}
          onClick={this.handleOpenCarrosel}
        />
        {/* <div
          key={'attachment-label-' + this.props.index}
          className={'attachment-label'}
        >
          {this.props.fileName}
        </div> */}
      </div>
    )
  }
  handleRemove = () => {
    this.props.RemoveAttachment(this.props.index)
  };
  handleSaveToDisk = () => {
    this.props.SaveToDisk(this.props.item, this.props.fileName)
  };

  handleOpenCarrosel = () => {
    this.props.openCarrosel(this.props.index)
  };
}

Attachment.propTypes = {
  fileName: PropTypes.string,
  index: PropTypes.number,
  item: PropTypes.string,
  selectedItem: PropTypes.number,
  RemoveAttachment: PropTypes.func,
  openCarrosel: PropTypes.func,
  SaveToDisk: PropTypes.func,
}

export default Attachment

import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { Modal } from 'react-bootstrap'
import Slider from 'react-slick'
import DropZone from 'react-dropzone'
// import '../../../../style/slider/slick.css'
import { HotKeys } from 'react-hotkeys'
import ArrowButton from './ArrowButton.react'
import PropTypes from 'prop-types'
import Attachment from './Attachment.react'

class Attachments extends React.Component {
  constructor(props) {
    super(props)
    const value = props.value
      ? props.type === 'string' ? [props.value] : props.value
      : []
    this.state = {
      value: value,
      initInEditingMode: props.isEditing,
      showCarousel: false,
      showAddingModal: false,
      initialSlide: 0,
      showModal: false,
      selectedItem: null,
    }
  }

  onNextImage = () => {
    ReactDOM.findDOMNode(this.nextArrow).click()
  };

  onPrevImage = () => {
    ReactDOM.findDOMNode(this.prevArrow).click()
  };
  handleCaroselClose = () => {
    ReactDOM.findDOMNode(this.attachmentsModalBody).focus()
  };
  onDeleteKeyPress = e => {
    e.preventDefault()
    if (this.state.selectedItem === null) {
      return
    }
    this.RemoveAttachment(this.state.selectedItem)
  };
  onSaveKeyPress = e => {
    e.preventDefault()
    if (this.state.selectedItem === null) {
      return
    }
    var item = this.state.value[this.state.selectedItem]
    // var splitUrl = item.split('/')
    var fileName = `${this.props.fieldName}[${this.state.selectedItem}]`
    this.SaveToDisk(item, fileName)
  };
  onEnter = () => {
    if (this.state.selectedItem === null) {
      this.dropZone.open()
    } else {
      this.openCarrosel(this.state.selectedItem)
    }
  };
  handleModalFocus = () => {
    ReactDOM.findDOMNode(this.attachmentsModalBody).focus()
  };

  handleCaroselFocus = () => {
    ReactDOM.findDOMNode(this.slider).focus()
  };
  onMoveRight = () => {
    if (this.state.value.length === 0) {
      return
    }
    var nextSelected = this.state.selectedItem === null
      ? 0
      : this.state.selectedItem < this.state.value.length - 1
        ? this.state.selectedItem + 1
        : this.state.selectedItem
    this.setState({ selectedItem: nextSelected })
  };
  onMoveLeft = () => {
    var nextSelected = this.state.selectedItem === 0 ||
      this.state.selectedItem === null
      ? null
      : this.state.selectedItem - 1
    this.setState({ selectedItem: nextSelected })
  };
  handleCloseModal = () => {
    this.setState({ showModal: false, selectedItem: null })
  };
  handleModalExited = () => {
    this.props.onExitEdit()
  };

  handleCloseCarousel = () => {
    this.setState({ showCarousel: false })
  };
  openCarrosel = selectedItem => {
    this.setState({
      showCarousel: true,
      initialSlide: selectedItem,
    })
  };
  caroselItemChange = selectedItem => {
    console.log(`selected-${selectedItem}`)
  };
  RemoveAttachment = index => {
    if (this.props.type === 'string') {
      this.props.setChange('')
    } else {
      var value = this.state.value
      value.splice(index, 1)
      this.props.setChange(value)
    }
  };
  handleDrop = files => {
    _.each(files, file => {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (this.props.type === 'string') {
          this.props.setChange(reader.result)
        } else {
          const newValue = this.state.value
          newValue.push(reader.result)
          this.props.setChange(newValue)
        }
      }
      reader.onerror = function(error) {
        console.log('Error: ', error)
      }
    })
  };
  SaveToDisk(dataURL, fileName) {
    // const fileExt = dataURL.split(';')[0].split('/')[1]
    // for non-IE
    // var fileName = fileName;
    if (!window.ActiveXObject) {
      var element = document.createElement('a')
      element.setAttribute('href', dataURL)
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } else if (document.execCommand) {
      // for IE
      var _window = window.open(dataURL, '_blank')
      _window.document.close()
      _window.document.execCommand('SaveAs', true, fileName || dataURL)
      _window.close()
    }
  }
  componentWillReceiveProps(nextProps) {
    const newValue = nextProps.value
      ? this.props.type === 'string' ? [nextProps.value] : nextProps.value
      : []
    this.setState({
      value: newValue,
      showModal: nextProps.isEditing,
      selectedItem: null,
    })
  }
  componentDidUpdate() {}
  render() {
    const handlers = {
      closeForm: this.handleCloseModal,
      moveDown: this.onMoveRight,
      moveUp: this.onMoveLeft,
      moveRight: this.onMoveRight,
      moveLeft: this.onMoveLeft,
      selectItem: this.onEnter,
      save: this.onSaveKeyPress,
      delete: this.onDeleteKeyPress,
    }

    const handlersCarosel = {
      moveRight: this.onNextImage,
      moveLeft: this.onPrevImage,
    }
    var carouselItems = []
    var attachmentForList = []
    var attachmentForModal = []
    var that = this
    var value = this.state.value
    var isEditing = this.props.isEditing
    attachmentForModal.push(
      <DropZone
        className={`h5 w5 mh3 mb3 br2 tc dim flex items-center justify-center f-6 bw-1 b--dashed br3 b--black-90${this.state.selectedItem !== null ? ' ' : ' pointer shadow-1'}`}
        key="drop-zone-control"
        onDrop={this.handleDrop}
        ref={ref => {
          this.dropZone = ref
        }}
      >
        <i className={'fa fa-paperclip fa-flip-horizontal fa-flip-vertical'} />
      </DropZone>
    )
    _.map(value, function(item, index) {
      attachmentForList.push(
        <img
          key={`listAtt-${index}`}
          className={
            'mt0 mr0 br3 ba b--moon-gray pa1 bg-white h-inherit ml2 attachment'
          }
          src={item}
        />
      )
      if (isEditing) {
        attachmentForModal.push(
          <Attachment
            key={`attachment-${index}`}
            index={index}
            item={item}
            selectedItem={that.state.selectedItem}
            RemoveAttachment={that.RemoveAttachment}
            SaveToDisk={that.SaveToDisk}
            fileName={`${that.props.fieldName}[${index}]`}
            openCarrosel={that.openCarrosel}
          />
        )
        carouselItems.push(
          <div key={`carousel-item-container-${index}`} className={'w-auto'}>
            <img
              key={`carousel-item-${index}`}
              className={'w-auto center vh-75'}
              src={item}
            />
          </div>
        )
      }
    })

    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      initialSlide: this.state.initialSlide,
      afterChange: this.caroselItemChange,
      nextArrow: (
        <ArrowButton
          ref={ref => {
            this.nextArrow = ref
          }}
          className="right-0 br-100 bg-black"
        />
      ),
      prevArrow: (
        <ArrowButton
          ref={ref => {
            this.prevArrow = ref
          }}
          className="left-0 br-100 bg-black"
        />
      ),
    }
    var carouselModal = (
      <Modal
        show={this.state.showCarousel}
        dialogClassName={'h-100 w-100 overflow-hidden carousel-modal'}
        onHide={this.handleCloseCarousel}
        autoFocus
        onExited={this.handleCaroselClose}
        onFocus={this.handleCaroselFocus}
      >
        <Modal.Header closeButton className="tc">
          <Modal.Title> {this.props.title || this.props.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HotKeys
            handlers={handlersCarosel}
            ref={ref => {
              this.slider = ref
            }}
          >
            <Slider {...settings} className={'h-100'}>
              {carouselItems}
            </Slider>
          </HotKeys>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    )

    if (!this.state.initInEditingMode) {
      const border = this.props.hasError
        ? 'ba b--red '
        : this.props.isFocus ? 'ba b--blue ' : ''
      return (
        <div
          className={`h-inherit pv1 nowrap overflow-hidden ${border}`}
          onDoubleClick={this.handleEdit}
        >
          {attachmentForList}
          <Modal
            show={this.state.showModal}
            bsSize="lg"
            onHide={this.handleCloseModal}
            onExited={this.handleModalExited}
            onFocus={this.handleModalFocus}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {this.props.title || this.props.label}
              </Modal.Title>
            </Modal.Header>
            {/* <Modal.Body modalClassName={'attachment-popup'}> */}
            <Modal.Body>
              <HotKeys
                handlers={handlers}
                ref={ref => {
                  this.attachmentsModalBody = ref
                }}
                className={'flex flex-row items-start flex-wrap'}
              >
                {attachmentForModal}
              </HotKeys>
            </Modal.Body>
          </Modal>
          {carouselModal}
        </div>
      )
    }
    const borderColor = this.props.hasError ? 'b--red ' : 'b--moon-gray'
    return (
      <HotKeys handlers={handlers}>
        <div
          className={`flex flex-row items-start flex-wrap ba br3 ${borderColor}`}
          onDoubleClick={this.handleEdit}
        >
          {attachmentForModal}
        </div>
      </HotKeys>
    )
  }
  handleEdit = ev => {
    ev.preventDefault()
    this.props.onEditCell(ev)
  };
}

Attachments.defaultProps = {
  value: [],
}

Attachments.propTypes = {
  type: PropTypes.string,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  isFocus: PropTypes.bool,
  setChange: PropTypes.func,
  isEditing: PropTypes.bool,
  onExitEdit: PropTypes.func,
  onEditCell: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  cell: PropTypes.any,
  hasError: PropTypes.bool,
}

export default Attachments

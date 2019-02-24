import React, { Component} from 'react';
import TextControl from './TextControl';
import NumericUnitControl from './NumericUnitControl';
import AutocompleteControl from './AutocompleteControl';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import PropTypes from 'prop-types';
import ModalBox from './ModalBox';
import PlaceholderFastImage from './PlaceholderFastImage';
import StatusBox from './StatusBox';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ScrollView,
    Dimensions
  } from 'react-native';


export default class EditPropertyForm extends Component{

  constructor(props) {
    super(props);
    this.state = {
        property: this.props.property,
        showForm: false,
        formTarget: null,
        showDeleteModal: false,
        deleteModalAction: null,
        deleteModalDescription: '',
        deleteModalCloseAction: null,
        deleteModalButtonText: '',
        showStatusBox: false,
        statusBoxSuccess: false,
        statusBoxText: ''
     };
  }

  _updatePropertyWithPlaceId(placeId){
    var property = {...this.state.property};
    property.google_place_id = placeId;
    this.setState({property: property}, this._updateProperty);
  }

  _updateProperty(){
    this.props.updateProperty(this.state.property, this.props.user.info.id)
    .then(() => {
            this.setState({showStatusBox: true, statusBoxSuccess: true, statusBoxText: 'Property updated!'})
            this._hideForm();
        })
    .catch((e) => {
        this.setState({showStatusBox: true, statusBoxSuccess: false, statusBoxText: 'There was a problem updating the information. Are all the details in the correct format?'})
    });
  }

  _cancelChanges(){
      this.props.updateLocationSuggestions([]);
      this.setState({property: this.props.property, showForm: false, formTarget: null});
  }

  _hideForm(){
      this.setState({showForm: false, formTarget: null});
  }

  _handleChangeActive(isActive) {
      this.props.activateProperty(isActive)
      .then(() => {
        this.setState({property: {...this.state.property, listing_active: isActive}});
      })
      .then(() => {
        this.setState({showStatusBox: true, statusBoxSuccess: true, statusBoxText: `Your listing is ${ isActive ? 'active' : 'inactive'}!`})
      })
      .catch((e) => {
          this.setState({showStatusBox: true, statusBoxSuccess: false, statusBoxText: e.statusCode == 400 ? e.message : 'There was a problem activating your listing.'});
      });
  }

  _showForm(shouldShow, formTarget){
    if(shouldShow){
        this.setState({ showForm: true, formTarget: formTarget });
    }
    else{
        this._hideForm();
    }
  }

  _deleteProperty(){
    this.setState({
        deleteModalAction: this.props.deleteProperty,
        deleteModalCloseAction: this.setState({showDeleteModal: false}),
        deleteModalButtonText: "Delete Property",
        deleteModalDescription: "Are you sure you want to delete this property? All viewings will be cancelled as well."
    });

    this.setState({showDeleteModal: true});
  }

  _manageViewings(){
      this.props.getPropertyViewings(this.props.property.id)
      .then(() => {
        this.props.goToScreen('ManageViewingsScreen', {property: this.props.property})
      })
      .catch(() => {
          console.log(e);
      })
  }

  _showControl(){
    switch(this.state.formTarget){
        case 'description': {
            return (
                <TextControl
                    value={this.state.property.description}
                    handleChange={(value) => { this.setState({property: {...this.state.property, description: value}})}}
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    property={this.state.property}
                    title="Description"
                    description="Describe the property"
                    multiline={true}
                />
             )
        }
        case 'price': {
            return (
                <NumericUnitControl
                    value={this.state.property.price}
                    handleChange={(value) => { this.setState({property: {...this.state.property, price: value}})}}
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    property={this.state.property}
                    unit="£/m"
                    title="Price"
                    description="What's the monthly cost of your property"
                />
            )
        }
        case 'bedrooms': {
            return (
                <NumericUnitControl
                    value={this.state.property.bedrooms}
                    handleChange={(value) => { this.setState({property: {...this.state.property, bedrooms: value}})}}
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    property={this.state.property}
                    unit="bedroom(s)"
                    title="Bedrooms"
                    description="Number of bedrooms"
                />
            )
        }

        case 'bathrooms': {
            return (
                <NumericUnitControl
                    value={this.state.property.bathrooms}
                    handleChange={(value) => { this.setState({property: {...this.state.property, bathrooms: value}})}}
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    property={this.state.property}
                    unit="bathrooms(s)"
                    title="Bathrooms"
                    description="Number of bathrooms"
                />
            )
        }

        case 'livingrooms': {
            return (
                <NumericUnitControl
                    value={this.state.property.living_rooms}
                    handleChange={(value) => { this.setState({property: {...this.state.property, living_rooms: value}})}}
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    property={this.state.property}
                    unit="rooms(s)"
                    title="Living Rooms"
                    description="Number of living rooms"
                />
            )
        }

        case 'address': {
            return <AutocompleteControl
                    style={styles.autoCompleteControl}
                    title="Property Address"
                    description=""
                    updateProperty={(placeId) => this._updatePropertyWithPlaceId(placeId)}
                    placeholder="Type an address"
                    getLocationSuggestions={(text) => {this.props.getLocationSuggestions(text, 'address')}}
                    suggestions={this.props.autocompleteSuggestions}
                    updateLocationSuggestions={(suggestions) => { this.props.updateLocationSuggestions(suggestions) }}
                />
        }
        default:
            return null;
    };
  }

  render() {
    return (
        <View style={{flex: 1}}>
            <ScrollView style={{backgroundColor: 'white', flex: 1}}>
                <View style={styles.container}>
                    <PlaceholderFastImage style={styles.propertyThumbnail} source={{uri: this.props.property.images.length > 0 ? this.props.property.images[0].url : ''}} />
                    <TouchableHighlight style={styles.opaqueLayer} onPress={() => { this.props.goToScreen('UploadPhotosScreen'); }}>
                        <Text style={styles.photosBtn}>Manage Media</Text>
                    </TouchableHighlight>
                    <View style={styles.deletePropertyCell}>
                        <TouchableHighlight style={styles.ctaButton} onPress={() => {this._manageViewings()}}>
                            <Text style={styles.ctaText}>Manage Viewings</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Status</Text>
                            <Text style={styles.sectionValue}>{this.props.property.listing_active ? 'Listing active' : 'Listing Inactive'}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            {/* <Switch style={styles.activeSwitch} onValueChange = {(value) => {this._handleChangeActive(value) }} value = {this.state.property.listing_active}/> */}
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Address</Text>
                            <Text style={styles.sectionValue}>{this.props.property.address}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'address')}}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.sectionValue}>{this.state.property.description}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'description')}}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Price</Text>
                            <Text style={styles.sectionValue}>{this.state.property.price} £/m</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'price')}}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Bedrooms</Text>
                            <Text style={styles.sectionValue}>{this.state.property.bedrooms}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'bedrooms')}}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Bathrooms</Text>
                            <Text style={styles.sectionValue}>{this.state.property.bathrooms}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'bathrooms')}}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Living Rooms</Text>
                            <Text style={styles.sectionValue}>{this.state.property.living_rooms}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'livingrooms')}}>Edit</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.deletePropertyCell}>
                    <TouchableHighlight style={styles.deleteButton} onPress={() => {this._deleteProperty()}}>
                        <Text style={styles.ctaText}>Delete Property</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
                {
                    !this.state.showForm ?
                    null :
                    <View>
                        <TouchableHighlight style={styles.formOverlay} onPress={() => {this._cancelChanges()}}><Text></Text></TouchableHighlight>
                        <View style={styles.formContainer}>
                            {
                                this._showControl()
                            }
                        </View>
                    </View>
                }
                {
                    !this.state.showDeleteModal ? null :
                    <ModalBox
                        close={() => this.setState({showDeleteModal: true})}
                        delete={() => this.props.deleteProperty()}
                        description="Are you sure you want to delete this property?"
                        deleteText="Delete Property"
                    />
                }
                {
                    !this.state.showStatusBox ? null :
                    <StatusBox
                        close={() => {this.setState({showStatusBox: false})}}
                        isSuccess={this.state.statusBoxSuccess}
                        text={this.state.statusBoxText}
                    />
                }
        </View>
    )
  }
}

EditPropertyForm.propTypes = {
    property: PropTypes.object.isRequired,
    updateProperty: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    getLocationSuggestions: PropTypes.func.isRequired,
    updateLocationSuggestions: PropTypes.func.isRequired,
    autocompleteSuggestions: PropTypes.array.isRequired,
    updateLocationSuggestions: PropTypes.func.isRequired,
    deleteProperty: PropTypes.func.isRequired,
    activateProperty: PropTypes.func.isRequired,
    getPropertyViewings: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
      flex: 0.2,
      backgroundColor: 'white',
    },
    viewTitle: {
        fontSize: FontSizes.DEFAULT,
        color: Colors.DARK_GREY
    },
    propertyThumbnail: {
        height: 250,
        alignSelf: 'stretch'
    },
    opaqueLayer: {
        height: 250,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center'
    },
    photosBtn:{
      color: 'white',
      alignSelf: 'center',
      fontSize: FontSizes.MEDIUM_BIG
    },
    propertyDetailCell: {
        flexDirection: 'row',
        height: 100,
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.LIGHT_GRAY,
        padding: 10,
    },
    deletePropertyCell: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.LIGHT_GRAY,
    },
    detailsColumn: {
        flex: 1,
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },
    sectionTitle: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY
    },
    sectionValue: {
        fontSize: FontSizes.DEFAULT,
        color: Colors.DARK_GREY,
        flex: 1,
        flexWrap: 'wrap',
    },
    sectionActionContainer: {
        flex: 0.5
    },
    editSectionTxt: {
        color: Colors.AQUA_GREEN,
        alignSelf: 'flex-end',
        fontSize: FontSizes.DEFAULT
    },
    detailColumn: {
        flex: 0.9
    },
    iconsContainer: {
      marginTop: 10,
      flexDirection: 'row',
      flex: 1
    },
    descriptionIcon: {
      fontSize: FontSizes.SMALL_TEXT,
      marginRight: 5,
      color: Colors.LIGHT_GRAY
    },
    descriptionIconBig: {
        fontSize: FontSizes.DEFAULT,
        marginRight: 4,
        color: Colors.LIGHT_GRAY,
      },
    iconText: {
        marginRight:10,
        color: Colors.LIGHT_GRAY
    },
    formOverlay: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        flex: 1,
        height:  Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    formContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        alignSelf: 'center',
        flex: 1,
        height:  400,
        width: Dimensions.get('window').width,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    activeSwitch: {
        alignSelf: 'flex-end',
        marginTop: 15
    },
    autoCompleteControl: {
        flex: 1
    },
    ctaButton: {
        backgroundColor: Colors.AQUA_GREEN,
        flex: 1,
        height: 60,
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10
      },
    ctaText: {
        color: 'white',
        textAlign: 'center',
        fontSize: FontSizes.DEFAULT
    },
    deleteButton: {
        backgroundColor: Colors.RED,
        height: 60,
        justifyContent: 'center',
        flex: 1
    }
  });


import React, { Component} from 'react';
import TextControl from './TextControl';
import NumericUnitControl from './NumericUnitControl';
import RoomsControl from './RoomsControl';
import AutocompleteControl from './AutocompleteControl';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import PropTypes from 'prop-types';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableHighlight,
    ScrollView,
    Switch,
    Dimensions
  } from 'react-native';

  
export default class EditPropertyForm extends Component{

  constructor(props) {
    super(props);
    this.state = { 
        property: this.props.property,
        showForm: false,
        formTarget: null
     };
  }

  _updatePropertyWithPlaceId(placeId){
    console.log(placeId);

    var property = {...this.state.property};
    property.google_place_id = placeId;
    this.setState({property: property}, this._updateProperty);
  }

  _updateProperty(){
    this.props.updateProperty(this.state.property, this.props.user.info.id)
    .then(() => {
            console.log('success updating property');
            this._hideForm();
        })
    .catch((e) => {
        console.error(e);
    });
  }

  _cancelChanges(){
      this.props.updateLocationSuggestions([]);
      this.setState({property: this.props.property, showForm: false, formTarget: null});
  }

  _hideForm(){
      this.setState({showForm: false, formTarget: null});
  }

  _handleChangeActive(value) {
      this.setState({property: {...this.state.property, listing_active: value}}, this._updateProperty);
  }

  _showForm(shouldShow, formTarget){
    if(shouldShow){
        this.setState({ showForm: true, formTarget: formTarget });
    }
    else{
        this._hideForm();
    }
  }

  _showControl(){
    switch(this.state.formTarget){
        case 'name': {
            return (
                <TextControl 
                    value={this.state.property.name} 
                    handleChange={(value) => { this.setState({property: {...this.state.property, name: value}})}} 
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    property={this.state.property}
                    title="Name"
                    description="Give a name to your property"
                />
             )
        }
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
        case 'rooms': {
            return (
                <RoomsControl 
                    property={this.state.property} 
                    updateProperty={() => this._updateProperty()}
                    cancelChanges={() => {this._cancelChanges()}}
                    hideForm={() => {this._hideForm()}}
                    handleChangeBedrooms={(value) => { this.setState({property: {...this.state.property, bedrooms: value}})}} 
                    handleChangeLivingrooms={(value) => { this.setState({property: {...this.state.property, living_rooms: value}})}} 
                    handleChangeBathrooms={(value) => { this.setState({property: {...this.state.property, bathrooms: value}})}} 
                    title="Rooms"
                    description="How many rooms does your flat have?"
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
                    <ImageBackground style={styles.propertyThumbnail} source={{url: this.props.property.images.length > 0 ? this.props.property.images[0].url : ''}}>
                        <TouchableHighlight style={styles.opaqueLayer} onPress={() => { this.props.goToScreen('UploadPhotosScreen'); }}>
                            <Text style={styles.photosBtn}>Photos</Text>
                        </TouchableHighlight>
                    </ImageBackground>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Status</Text>
                            <Text style={styles.sectionValue}>Unlisted</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Switch style={styles.activeSwitch} onValueChange = {(value) => {this._handleChangeActive(value) }} value = {this.state.property.listing_active}/>
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
                            <Text style={styles.sectionTitle}>Name</Text>
                            <Text style={styles.sectionValue}>{this.state.property.name}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'name')}}>Edit</Text>
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
                            <Text style={styles.sectionTitle}>Rooms</Text>
                            <View style={styles.iconsContainer}>
                                <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                                <Text style={styles.iconText}>{this.state.property.bedrooms}</Text>
                                <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                                <Text style={styles.iconText}>{this.state.property.bathrooms}</Text>
                                <MaterialIcons name="sofa" style={styles.descriptionIconBig}/>
                                <Text style={styles.iconText}>{this.state.property.bathrooms}</Text>
                        </View>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'rooms')}}>Edit</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
                {
                    !this.state.showForm ? 
                    <TouchableHighlight style={styles.ctaButton} onPress={() => {this.props.goToScreen('ManageViewingsScreen', {property: this.props.property})}}>
                        <Text style={styles.ctaText}>Manage Viewings</Text>
                    </TouchableHighlight> :
                    <View>
                        <TouchableHighlight style={styles.formOverlay} onPress={() => {this._cancelChanges()}}><Text></Text></TouchableHighlight>
                        <View style={styles.formContainer} onPress={() => {console.log('do nothing')}}>
                            {
                                this._showControl()
                            }
                        </View>
                    </View>
                    
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
    updateLocationSuggestions: PropTypes.func.isRequired
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
        height: 180,
        alignSelf: 'stretch'
    },
    opaqueLayer: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center'
    },
    photosBtn:{
      color: 'white',
      alignSelf: 'center',
      fontSize: FontSizes.DEFAULT
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
        flex: 0.1,
        justifyContent: 'center'
      },
      ctaText: {
        color: 'white',
        textAlign: 'center',
        fontSize: FontSizes.DEFAULT
      },
  });


import React, { Component} from 'react';
import PropertyRow from '../../organisms/PropertyRow';
import DropdownControl from './DropdownControl';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import PropTypes from 'prop-types';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
    StyleSheet,
    Text,
    View,
    Image,
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
        formTarget: null, 
        formType: null
     };
  }

  _showForm(shouldShow, type, formTarget){
    if(shouldShow){
        this.setState({ showForm: true, formType: type, formTarget: formTarget });
    }
    else{
        this.setState({ showForm: false, formType: null, formTarget: null });
    }
  }

  _showControl(){
    switch(this.state.formType){
        case 'dropdown':
            if(this.state.formTarget == 'type'){
                return(
                    <DropdownControl 
                        optionsList={['Rent', 'Buy']} 
                        value={this.state.property.type} handleChange={(value) => { this.setState({property: {...this.state.property, type: value}})}}
                        title="Property Type"
                        description="Choose whether this property is up for rent or to be bought"/>
                )
            }
            return null;
        default:
            return null;
    };
  }

  render() {
    return (
        <View>
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={styles.container}>
                    <Image style={styles.propertyThumbnail} source={{url: this.props.property.thumbnail}}>
                        <TouchableHighlight style={styles.opaqueLayer}>
                            <Text style={styles.photosBtn}>Photos</Text>
                        </TouchableHighlight>
                    </Image>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Status</Text>
                            <Text style={styles.sectionValue}>Unlisted</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Switch onValueChange = {this.props.toggleSwitch1} value = {true}/>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Type</Text>
                            <Text style={styles.sectionValue}>{this.state.property.type}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt} onPress={() => {this._showForm(true, 'dropdown', 'type')}}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Title</Text>
                            <Text style={styles.sectionValue}>{this.props.property.name}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.sectionValue}>{this.props.property.description_sections[0].description}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Price</Text>
                            <Text style={styles.sectionValue}>{this.props.property.price} £/m</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Rooms</Text>
                            <View style={styles.iconsContainer}>
                                <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                                <Text style={styles.iconText}>{this.props.property.bedrooms}</Text>
                                <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                                <Text style={styles.iconText}>{this.props.property.bathrooms}</Text>
                        </View>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Address</Text>
                            <Text style={styles.sectionValue}>{this.props.property.address}, {this.props.property.postcode}, {this.props.property.city}</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt}>Edit</Text>
                        </View>
                    </View>
                    <View style={styles.propertyDetailCell}>
                        <View style={styles.detailColumn}>
                            <Text style={styles.sectionTitle}>Minimum Rental Period</Text>
                            <Text style={styles.sectionValue}>3 Months</Text>
                        </View>
                        <View style={styles.sectionActionContainer}>
                            <Text style={styles.editSectionTxt}>Edit</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
                {
                    !this.state.showForm ? null :
                    <TouchableHighlight style={styles.formOverlay} onPress={() => {this.setState({showForm: false})}}>
                        <View style={styles.formContainer}>
                            {
                                this._showControl()
                            }
                    </View>
                    </TouchableHighlight>
                    
                }
        </View>
    )
  }
}

EditPropertyForm.PropTypes = {
    property: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
        color: Colors.RED,
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
      marginRight: 10,
      color: Colors.LIGHT_GRAY
    },
    iconText: {
        marginLeft: 5,
        marginRight:10,
        color: Colors.LIGHT_GRAY
    },
    formOverlay: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        height:  Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    formContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        alignSelf: 'center',
        height:  Dimensions.get('window').height - 200,
        width: Dimensions.get('window').width,
        borderRadius: 10
    }
  });


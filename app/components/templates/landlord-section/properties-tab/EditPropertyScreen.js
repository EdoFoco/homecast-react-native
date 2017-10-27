import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import PropertyRow from '../../../organisms/PropertyRow';
import * as Colors from '../../../helpers/ColorPallette';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Switch
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //padding: 10
  },
  viewTitle: {
      fontSize: 20,
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
    fontSize: 18
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
      //fontSize: 12,
      color: Colors.LIGHT_GRAY
  },
  sectionValue: {
      fontSize: 16,
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
      fontSize: 18
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
    fontSize: 16,
    marginRight: 10,
    color: Colors.LIGHT_GRAY
  },
  iconText: {
      marginLeft: 5,
      marginRight:10,
      color: Colors.LIGHT_GRAY
  },
});

class EditPropertyScreen extends Component{

  render() {
    return (
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
                        <Text style={styles.sectionValue}>Rent</Text>
                    </View>
                    <View style={styles.sectionActionContainer}>
                        <Text style={styles.editSectionTxt}>Edit</Text>
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
    )
  }
}

EditPropertyScreen.navigationOptions = {
  title: 'Edit Listing',
};

const mapStateToProps = (state, navigation) => {
    return {
        user: state.user,
        property: navigation.navigation.state.params.property,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertyScreen);

import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import EditPropertyForm from '../../shared/EditPropertyForm';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class EditPropertyScreen extends Component{

  _deleteProperty(){
    this.props.deleteProperty(this.props.property.id, this.props.user.info.id)
    .then(() => {
      this.props.returnToLandlordTabBar();
    })
  }

  render() {
    if(!this.props.property){
      return <View></View>
    }
    return (
        <View style={{flex: 1}}>
          <View style={styles.menuWrapper}>
              <TouchableHighlight style={styles.backButton} onPress={() => {this.props.returnToLandlordTabBar()}}>
                <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
              </TouchableHighlight>
              <Text style={styles.menuText}>{this.props.property.address}</Text>
          </View>
            <View style={styles.fieldsForm}> 
                  <EditPropertyForm 
                    user={this.props.user}
                    property={this.props.property}
                    updateProperty={this.props.updateProperty}
                    user={this.props.user}
                    getLocationSuggestions={(text, type) => {this.props.getAddressSuggestions(text, type)}}
                    updateLocationSuggestions={(suggestions) => {this.props.updateLocationSuggestions(suggestions)}} 
                    autocompleteSuggestions={this.props.autocompleteSuggestions}
                    goToScreen={(screen) => {this.props.navigation.navigate(screen, {property: this.props.property})}}
                    deleteProperty={() => { this._deleteProperty() }}
                    activateProperty={async (isActive) => { await this.props.activateProperty(this.props.user.info.id, this.props.property.id, isActive)}}
                    getPropertyViewings={async (propertyId) => { await this.props.getPropertyViewings(propertyId) }}
                  /> 
                  </View>
              }
        </View>
    )
  }
}

EditPropertyScreen.navigationOptions = ({ navigation }) => {
  return( { header: null });
};

const mapStateToProps = (state, navigation) => {
    return {
        user: state.user,
        property: state.properties.propertiesList.find(p => p.id == navigation.navigation.state.params.property.id),
        autocompleteSuggestions: state.location.suggestions,
      }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertyScreen);

var styles = StyleSheet.create({
    menuWrapper: {
      flexDirection: 'row',
      backgroundColor: Colors.DARK_BLUE,
      paddingTop: 20,
      alignItems: 'center',
    },
    backButton: {
      alignSelf: 'center'
    },
    backButtonIcon: {
      fontSize: 45,
      color: Colors.AQUA_GREEN,
    },
    menuText: {
      color: Colors.AQUA_GREEN,
      fontSize: FontSizes.DEFAULT,
      alignSelf: 'center',
      textAlign: 'center',
      paddingBottom: 5,
      flex: 0.9
    },
    fieldsForm: {
      flex: 1
    }
});
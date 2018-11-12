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

  render() {
    return (
        <View style={{flex: 1}}>
          <View style={styles.menuWrapper}>
              <TouchableHighlight style={styles.backButton} onPress={() => {this.props.navigation.goBack()}}>
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
    activeTab: {
      flex: 0.5, 
      backgroundColor: Colors.DARK_BLUE,
      justifyContent: 'center'
    },
    activeTabText: {
      fontSize: FontSizes.DEFAULT,
      color: Colors.AQUA_GREEN,
      alignSelf: 'center',
    },
    tab: {
      flex: 0.5,
      backgroundColor: Colors.DARK_BLUE,
      justifyContent: 'center',
    },
    tabText: {
      fontSize: FontSizes.DEFAULT,
      color: 'white',
      alignSelf: 'center',
    },
    tabContent: {
      flex: 1,
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
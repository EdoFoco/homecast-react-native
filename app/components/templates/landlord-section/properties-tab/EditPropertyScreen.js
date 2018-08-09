import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import EditPropertyForm from '../../shared/EditPropertyForm';
import AddViewingForm from '../../shared/AddViewingForm';
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
                  <TouchableHighlight style={styles.ctaButton} onPress={() => {this.props.navigation.navigate('ManageViewingsScreen', {property: this.props.property})}}>
                    <Text style={styles.ctaText}>Manage Viewings</Text>
                  </TouchableHighlight>
                  {/* :
                  <AddViewingForm 
                  propertyId={this.props.property.id} 
                  userId={this.props.user.info.id} 
                  viewings={this.props.property.viewings}
                  isModalVisible={this.props.navigation.state.params.showAddViewingModal}
                  showModal={(showModal) => { this._showAddViewingModal(showModal)}}
                  createViewing={(propertyId, userId, viewingInfo) => this.props.createViewing(propertyId, userId, viewingInfo)}
                  goToViewing={(viewingId) => { this.props.navigation.navigate('ViewingScreen', { viewingId : viewingId, property: this.props.property}) }}
                /> */}
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
    fieldsForm: {
      flex: 0.9
    }
});
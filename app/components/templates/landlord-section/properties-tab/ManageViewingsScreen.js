import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ManageViewingsForm from '../../shared/ManageViewingsForm';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class ManageViewingsScreen extends Component{

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
                <ManageViewingsForm 
                  propertyId={this.props.property.id} 
                  userId={this.props.user.info.id} 
                  viewings={this.props.viewings}
                  createViewing={(propertyId, userId, viewingInfo) => this.props.createViewing(propertyId, userId, viewingInfo)}
                  goToViewing={(viewingId) => { this.props.navigation.navigate('ViewingScreen', { viewingId : viewingId, property: this.props.property, goBack: () => {this.props.navigation.goBack()}}) }}
                /> 
            </View>
        </View>
    )
  }
}

ManageViewingsScreen.navigationOptions = ({ navigation }) => {
  return( { header: null });
};

const mapStateToProps = (state, navigation) => {
    let property = state.properties.propertiesList.find(p => p.id == navigation.navigation.state.params.property.id)
    return {
        user: state.user,
        property: property,
        viewings : property.viewings,
        autocompleteSuggestions: state.location.suggestions,
      }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageViewingsScreen);

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
    },
    addViewingButton: {
        flex: 0.1,
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    addViewingIcon: {
        color: Colors.AQUA_GREEN,
        fontSize: FontSizes.TITLE
    }
});
import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import EditPropertyForm from '../../shared/EditPropertyForm';
import AddViewingForm from '../../shared/AddViewingForm';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';

class EditPropertyScreen extends Component{

  constructor(props) {
    super(props);

    this.state = {
        tabIndex: 1,
    }
   }

  _showAddViewingModal(showModal){
    this.props.navigation.setParams({showAddViewingModal: showModal});
  }

  render() {
    return (
        <View>
          <View style={styles.tabContainer}>
              <TouchableHighlight style={this.state.tabIndex == 1 ? styles.activeTab : styles.tab } onPress={() => {this.setState({tabIndex: 1}); this.props.navigation.setParams({tabIndex: 1})}}>
                <Text style={this.state.tabIndex == 1 ? styles.activeTabText : styles.tabText}>Details</Text>
              </TouchableHighlight>
              <TouchableHighlight style={this.state.tabIndex == 2 ? styles.activeTab : styles.tab } onPress={() => {this.setState({tabIndex: 2}); this.props.navigation.setParams({tabIndex: 2})}}>
                <Text style={this.state.tabIndex == 2 ? styles.activeTabText : styles.tabText}>Viewings</Text>
              </TouchableHighlight>
          </View>
          {
            this.state.tabIndex == 1 ?
              <EditPropertyForm 
              user={this.props.user}
              property={this.props.property}
              updateProperty={this.props.updateProperty}
              user={this.props.user}/> :
              <AddViewingForm 
              propertyId={this.props.property.id} 
              userId={this.props.user.info.id} 
              viewings={this.props.property.viewings}
              isModalVisible={this.props.navigation.state.params.showAddViewingModal}
              showModal={(showModal) => { this._showAddViewingModal(showModal)}}/>
          }
        </View>
    )
  }
}

EditPropertyScreen.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  const { setParams } = navigation;
  if(params.tabIndex && params.tabIndex == 2){
    return(
      {
        title: 'Edit Listing',
        headerRight: <TouchableHighlight onPress={() => { setParams({showAddViewingModal: true}) }}><Text style={{fontSize: 30, color: Colors.RED, marginRight: 20}}>+</Text></TouchableHighlight>,
      }
    );
  }
  
  return( { title: 'Edit Listing' });
};

const mapStateToProps = (state, navigation) => {
    return {
        user: state.user,
        property: state.properties.propertiesList.find(p => p.id == navigation.navigation.state.params.property.id),
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertyScreen);

var styles = StyleSheet.create({
    tabContainer: {
      backgroundColor: 'white',
      flexDirection: 'row'
    },
    activeTab: {
      flex: 0.5, 
      height: 50,
      backgroundColor: Colors.DARK_BLUE,
      justifyContent: 'center'
    },
    activeTabText: {
      fontSize: FontSizes.DEFAULT,
      color: Colors.AQUA_GREEN,
      alignSelf: 'center',
      fontWeight: 'bold'
    },
    tab: {
      flex: 0.5,
      height: 50,
      backgroundColor: Colors.DARK_BLUE,
      justifyContent: 'center',
    },
    tabText: {
      fontSize: FontSizes.DEFAULT,
      color: 'white',
      alignSelf: 'center',
      fontWeight: 'bold'
    }
});
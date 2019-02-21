import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewingsList from '../../shared/ViewingsList';
import { StyleSheet, View} from 'react-native';

class ViewingsContainer extends Component{
 
    _goToViewing(viewingId, property){
       this.props.goToLandlordViewingsScreen(viewingId, property, this.props.returnToLandlordTabBar);
       this.props.navigation.navigate('ViewingsStack');
      }

      render() {
        return (
          <View style={styles.container}>
            <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
            <ViewingsList 
              viewings={this.props.viewings} 
              goToViewing={(viewingId, property) => { this._goToViewing(viewingId, property)}}
              noViewingsMessage="You haven't added any viewings yet. Manage your viewings through the properties tab."
              />
          </View>
        )
      }
}

ViewingsContainer.navigationOptions = {
  tabBarIcon: ({ tintColor }) => (
      <Icon name="calendar-clock"  size={24} color={tintColor} style={{height: 24, width: 24}} />
    ),
};

const mapStateToProps = (state) => {
    var properties = [...state.properties.listings];
    var viewings = [];
    properties.forEach((property) => {
      property.viewings.forEach((viewing) => {
        viewing.property = property;
        viewings.push(viewing);
      });
    });
    
    return {
        user: state.user,
        network: state.network,
        viewings: viewings,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsContainer);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});
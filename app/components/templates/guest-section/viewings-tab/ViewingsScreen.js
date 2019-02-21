import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewingsList from '../../shared/ViewingsList';
import { StyleSheet, View} from 'react-native';

class ViewingsScreen extends Component{

  componentWillMount(){
    this.props.getViewingReservations(this.props.user.info.id)
    .catch((error) => {
      console.error(error);
    })
  }

  _goToViewing(viewingId, property){
    this.props.getViewing(viewingId)
    .then((viewing) => {
      this.props.goToGuestViewingsScreen(viewing, property);
      this.props.navigation.navigate('ViewingsStack');
    })
    .catch((e) => {
      console.log(e);
    });
  }
  

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
        <ViewingsList 
          viewings={this.props.viewingReservations} 
          goToViewing={(viewingId, property) => { this._goToViewing(viewingId, property)}}
          noViewingsMessage="You haven't added any viewings yet. Manage your viewings through the properties tab."
          />
      </View>
    )
  }
}

ViewingsScreen.navigationOptions = {
  tabBarLabel: 'Viewings',
  tabBarIcon: ({ tintColor }) => (
      <Icon name="calendar-clock"  size={24} color={tintColor} style={{height: 24, width: 24}} />
    ),
};


const mapStateToProps = (state) => {
   console.log(state);
   let viewings = state.viewings.viewingReservations.map(vr => vr.viewing);

   return {
     user: state.user,
     viewingReservations: viewings,
     network: state.network
   }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});
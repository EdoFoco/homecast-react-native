import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewingsList from '../../shared/ViewingsList';
import { StyleSheet, View} from 'react-native';
import ErrorScreen from '../../shared/ErrorScreen';
import InteractionBlocker from '../../shared/InteractionBlocker';
import FullScreenLoader from '../../shared/FullScreenLoader';

class ViewingsScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      showErrorScreen: false,
      showInteractionBlocker: false
    }
  }

  componentWillMount(){
    this.props.getViewingReservations(this.props.user.info.id)
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch((e) => {
      console.error(e);
      this.setState({isLoading: false, showErrorScreen: true})
    })
  }

  _goToViewing(viewingId, property){
    this.setState({showInteractionBlocker: true});
    this.props.getViewing(viewingId)
    .then((viewing) => {
      this.setState({showInteractionBlocker: false});
      this.props.goToGuestViewingsScreen(viewing, property);
      this.props.navigation.navigate('ViewingsStack');
    })
    .catch((e) => {
      console.log(e);
      this.setState({showInteractionBlocker: false, showErrorScreen: true});
    });
  }
  

  render() {
    if(this.state.isLoading){
      return (<FullScreenLoader />)
    }

    return (
      <View style={styles.container}>
        <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
        <ViewingsList 
          viewings={this.props.viewingReservations} 
          goToViewing={(viewingId, property) => { this._goToViewing(viewingId, property)}}
          noViewingsMessage="You haven't added any viewings yet. Manage your viewings through the properties tab."
          />
          {
            !this.state.showErrorScreen ? null :
            <ErrorScreen close={() => {this.setState({showErrorScreen: false})}} />
          }
          {
            !this.state.showInteractionBlocker ? null :
            <InteractionBlocker />
          }
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
import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import DateCell from '../../shared/DateCell';
import ViewingRow from '../../shared/ViewingRow';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  viewingRow:{
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomColor: Colors.LIGHT_GRAY,
    //borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewingDateCell: {
    width: 100,
    alignSelf: 'flex-start',
  },
  propertyName: {
    fontSize: FontSizes.DEFAULT,
    textAlign: 'left',
    flex: 1,
    paddingLeft: 10,
  },
  viewingTime:{
    flex: 0.7,
    fontSize: FontSizes.DEFAULT,
    textAlign: 'right',
    color: Colors.DARK_GREY,
    paddingRight: 10
  },
});

class ViewingsScreen extends Component{

  componentWillMount(){
    this.props.getViewingReservations(this.props.user.info.id)
    .catch((error) => {
      console.error(error);
    })
  }

  _goToViewing(viewingId){
    this.props.getViewing(viewingId)
    .then((viewing) => {
        this.props.navigation.navigate('Viewing', { viewing : viewing });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _renderRow = function({item}){
    let reservation = item;
    return (
        <ViewingRow viewing={reservation.viewing} goToViewing={(viewingId) => {this._goToViewing(reservation.viewing.id)} } />
      )
  }

  render() {
    return (
      <View style={styles.container}>
         
         <FlatList
          data={this.props.viewingReservations}
          renderItem={(reservation) => this._renderRow(reservation)}
          keyExtractor={(item, index) => index}
          removeClippedSubviews={false}
        />
            
      </View>

    )
  }
  
}

ViewingsScreen.navigationOptions = {
  title: 'Viewings Screen',
};


const mapStateToProps = (state) => {
   return {
     user: state.user,
     viewingReservations: state.viewings.viewingReservations
   }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsScreen);

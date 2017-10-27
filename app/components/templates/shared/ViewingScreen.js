import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../actions';
import { bindActionCreators } from 'redux';
import DateCell from './DateCell';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Button,
  Image
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  viewingDate: {
    height: 200,
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.React
  },
  viewingTitle: {
    marginTop: 20,
    fontSize: 26,
  },
  viewingDay: {
    fontSize: 40
  },
  viewingMonth: {
    fontSize: 26
  },
  viewingTime: {
    fontSize: 25,
    marginTop: 10
  },
  sectionContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  availabilityTitle:{
    textAlign: 'left',
    color: Colors.DARK_GREY,
    fontSize: FontSizes.DEFAULT,
    fontWeight: 'bold',
  },
  availabilityValue: {
    fontSize: FontSizes.DEFAULT,
    flex: 0.6,
    textAlign: 'left',
    color: Colors.DARK_GREY,
    padding: 10
  },
  secureSpotBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.AQUA_GREEN,
    padding: 10,
  },
  secureBtnText: {
    fontSize: FontSizes.DEFAULT,
    color: 'white',
  },
  userDetails: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10
  },
  userName: {
      fontSize: FontSizes.DEFAULT
  },
  userAbout: {
      marginTop: 10,
      fontSize: FontSizes.DEFAULT,
      color: Colors.DARK_GREY,
      textAlign: 'left',
      alignSelf: 'stretch'
  },
  joinCastContainer: {
      backgroundColor: 'white',
      alignSelf: 'stretch',
      justifyContent: 'center'
  },
  joinCastBtn: {
    backgroundColor: Colors.RED,
    height: 40,
    width: 350,
    margin: 10,
    justifyContent: 'center'
  },
  joinCastTxt: {
      color: 'white',
      textAlign: 'center',
      fontSize: FontSizes.DEFAULT
  }
});

class ViewingScreen extends Component{

  render() {
    return(
        <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={styles.viewingDate}>
                        <DateCell style={styles.viewingDate} 
                        dateTime={this.props.viewing.date_time} 
                        showTime={true}
                        titleStyle={styles.viewingTitle}
                        dayStyle={styles.viewingDay}
                        monthStyle={styles.viewingMonth}
                        timeStyle={styles.viewingTime}/>
                    </View>
                <View style={styles.container}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.availabilityTitle}>Availability</Text>
                        <View style={styles.availabilityContainer}> 
                            <Text style={styles.availabilityValue}>Only 10 spots left</Text>
                            <TouchableHighlight style={styles.secureSpotBtn}>
                                <Text style={styles.secureBtnText}>Reserve Spot</Text>
                            </TouchableHighlight>
                    </View>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.availabilityTitle}>Presenter</Text>
                        <View style={styles.userDetails}> 
                            <Text style={styles.userName}>{this.props.user.info.name}</Text>
                            <Image style={styles.userImage} source={{url: this.props.user.info.profile_picture}}/>
                            <Text style={styles.userAbout}>{this.props.user.info.about}</Text>
                    </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.joinCastContainer}>
                <TouchableHighlight style={styles.joinCastBtn}>
                    <Text style={styles.joinCastTxt}>
                        Join Live Cast
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    )
  }
}


ViewingScreen.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.viewing.property.name}`,
});


const mapStateToProps = (state, {navigation}) => {
    return {
        viewings: state.properties.currentPropertyViewings,
        viewing: navigation.state.params.viewing,
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingScreen);

import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  ListViewDataSource,
  TouchableHighlight,
  Image
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  propertyDescriptionWrapper: {
    //flex: 1,
    //flexDirection: 'row',
    alignSelf: 'stretch',
    //height: 80,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: 'center'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    height: 200
  },
  viewingsContainer:{
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'center'
  },
  viewingsList: {
      height: 80
  },
  liveViewingsTitle: {
      backgroundColor: "rgba(246,67,74,1)", 
      alignSelf: 'stretch', 
      color:'white',
      fontSize: 20,
      padding: 10, 
      justifyContent: 'center'
    }
});

class PropertyScreen extends Component{

  componentWillMount(){
   
    this.props.getPropertyViewings(this.props.currentProperty.id);
  }

  _onPress(viewing){
      console.log(viewing);
      //this.props.goToScreen('Viewings');
      this.props.navigation.navigate('Other', { viewing : viewing });
    }

  _renderRow = function(rowData, rowId){
    var date = new Date(rowData.date_time);
    var month = date.toLocaleString("en-gb", { month: "long" });
    return (
            <TouchableHighlight onPress={() => this._onPress(rowData)}>
                <View style={{backgroundColor: 'white', margin:10, padding:10, height: 60}}>
                    <Text style={{color:'black'}}>{date.getHours() + ':' + date.getMinutes()}</Text>
                    <Text style={{color:'black'}}>{date.getDay() + ' ' + month + ' ' + date.getFullYear()}</Text>
                </View>
            </TouchableHighlight>
        )
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={{flexDirection: 'row'}} >
                <Image source={{uri: this.props.currentProperty.thumbnail}} style={styles.backgroundImage} >
                    <View style={{flex:1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between'}}/>
                        <View style={styles.propertyDescriptionWrapper}>
                            <Text style={{color:'white', fontSize: 20}}>{this.props.currentProperty.name}</Text>
                            <Text style={{ color:'white'}}>{this.props.currentProperty.address}</Text>
                        </View>
                    </View>
                </Image>
            </View>
        
         <View style={styles.viewingsContainer}>
            <Text style={styles.liveViewingsTitle}>Live Viewings Dates</Text>
            <ListView
                dataSource={this.props.viewings}
                enableEmptySections={true}
                horizontal={true}
                style={styles.viewingsList}
                renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
            />
         </View>
         
      </View>

    )
  }
  
}

PropertyScreen.navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.property.name}`,
  });
  

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state, navigation) => {
    console.log('PropertyScreen');
    console.log(state);
    console.log(navigation);
    var rowIds = state.properties.currentPropertyViewings.map((row, index) => index);
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        viewings: ds.cloneWithRows(state.properties.currentPropertyViewings, rowIds),
        currentProperty: navigation.navigation.state.params.property
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyScreen);

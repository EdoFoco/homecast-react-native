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
  TouchableHighlight
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

class ViewingsScreen extends Component{

  componentWillMount(){
    this.props.getProperties();
  }

  _onPress(){
      //this.props.goToScreen('Viewings');
      this.props.navigation.navigate('Other');
  }

  _renderRow = function(rowData, rowId){
    console.log(rowData.name);
    return (
            <View style={{flex: 1, backgroundColor: 'white', borderRadius:10, margin:10, padding:10}}>
                <Text style={{flex: 1, color:'black'}}>{rowData.name}</Text>
                <Text style={{flex: 1, color:'black'}}>{rowData.address}</Text>
            </View>
        )
  }

  render() {
    return (
      <View style={styles.container}>
         <ListView
            dataSource={this.props.properties}
            enableEmptySections={true}
            renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
          />

          <Text style={styles.welcome}>
            Viewings Screen
          </Text>
            <TouchableHighlight style={styles.button} onPress={this._onPress.bind(this)} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Go To Other</Text>
              </TouchableHighlight>
      </View>

    )
  }
  
}

ViewingsScreen.navigationOptions = {
  title: 'Viewings Screen',
};



const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state) => {
   console.log('ViewingsScreen');
    console.log(state);

    var rowIds = state.properties.propertiesList.map((row, index) => index);
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        properties: ds.cloneWithRows(state.properties.propertiesList, rowIds),
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsScreen);

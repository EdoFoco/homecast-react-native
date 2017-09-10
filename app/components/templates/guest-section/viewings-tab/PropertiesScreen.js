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
    flex: 1
  },
  propertyButton:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    height: 200
  },
  propertyDescriptionWrapper: {
      //flex: 1,
      //flexDirection: 'row',
      alignSelf: 'stretch',
      //height: 80,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: 'center'
    }
});

class PropertiesScreen extends Component{

  componentWillMount(){
    this.props.getProperties();
  }

  
_onPress(property){
    //this.props.goToScreen('Viewings');
    console.log(property);
    this.props.navigation.navigate('PropertyScreen', { property : property});
}

  _renderRow = function(rowData, rowId){
    console.log(rowData.name);
    return (
            <TouchableHighlight style={styles.propertyButton} onPress={() => this._onPress(rowData)}>
                <Image source={{uri: rowData.thumbnail}} style={styles.backgroundImage} >
                    <View style={{flex:1, flexDirection: 'column'}}>
                        <View style={{flex:1, justifyContent: 'space-between'}}/>
                        <View style={styles.propertyDescriptionWrapper}>
                            <Text style={{color:'white', fontSize: 20}}>{rowData.name}</Text>
                            <Text style={{ color:'white'}}>{rowData.address}</Text>
                        </View>
                    </View>
            </Image>
            </TouchableHighlight>
        )
  }

  render() {
    return (
      <View style={styles.container}>
         <ListView
            dataSource={this.props.properties}
            enableEmptySections={true}
            style={{marginTop: 20}}
            renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
          />
      </View>

    )
  }
  
}

PropertiesScreen.navigationOptions = {
  title: 'Properties',
};

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state) => {
   console.log('PropertiesScreen');
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

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);

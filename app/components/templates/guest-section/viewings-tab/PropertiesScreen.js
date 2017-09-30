import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
    backgroundColor: 'white'
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
  propertContainer: {
    flex: 1,
    alignSelf: 'stretch'
  },
  propertyDescriptionWrapper: {
      alignSelf: 'stretch',
      height: 100,
      padding: 20,
      paddingTop: 10
    },
  propertyTitle: {
    color: '#011627',
    fontSize: 18
  },
  descriptionText: {
    color: '#9E9E9E'
  },
  priceBadge:{
    backgroundColor: '#2EC4B6',
    top: 150,
    color: 'white',
    position: 'relative',
    left: 0,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 35,
    paddingLeft: 10,
    paddingRight: 10,
    width: 150
  },
  profilePicture: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: -40,
    right: 10,
    alignSelf: 'flex-end',
    borderRadius: 40,
    backgroundColor: 'blue'
  },
  iconsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1
  },
  descriptionIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#9E9E9E'
  },
  iconText: {
    marginLeft: 5,
    marginRight:10,
    color: '#9E9E9E'
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
              <View style={styles.propertContainer}>
                <Image source={{uri: rowData.thumbnail}} style={styles.backgroundImage} >
                  <Text style={styles.priceBadge}>£ {Math.round(rowData.price)} p/m</Text>
                </Image>
                <View style={{flex:1, flexDirection: 'column'}}>
                    <View style={{flex:1}}/>
                    <Image source={{uri: rowData.user.profile_picture}} style={styles.profilePicture}/>
                    <View style={styles.propertyDescriptionWrapper}>
                        <Text style={styles.propertyTitle}>{rowData.name}</Text>
                        <Text style={styles.descriptionText}>{rowData.address}</Text>
                        <View style={styles.iconsContainer}>
                          <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                          <Text style={styles.iconText}>{rowData.rooms}</Text>
                          <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                          <Text style={styles.iconText}>{rowData.bathrooms}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </TouchableHighlight>
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

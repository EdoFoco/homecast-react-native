import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import AdminViewingScreen from '../../shared/AdminViewingScreen';
import { View } from 'react-native';

class ViewingScreen extends Component{
  
  componentWillMount(){
      this.props.getViewing(this.props.viewing.id);
  }

  _joinLiveCast(){
    this.props.navigation.navigate('LiveCast', {viewing: this.props.viewing})
  }
  
  _deleteViewing(){
    return this.props.goBack();
    // this.props.deleteViewing(this.props.viewing.id)
    // .then(() => {
    //   return this.props.getProperty(this.props.property.id);
    // })
    // .then(() => {
    //   return this.props.navigation.goBack();
    // })
    // .catch((e) => {
    //   console.error(e);
    // })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <AdminViewingScreen 
            viewing={this.props.viewing}
            property={this.props.property}
            user={this.props.user}
            joinLiveCast={() => {this._joinLiveCast()}}
            deleteViewing={() => {this._deleteViewing()}}
            network={this.props.network}
        />
      </View>
    )
  }
}

ViewingScreen.navigationOptions = () => {
    return {
      header: null
  }
};


const mapStateToProps = (state, {navigation}) => {
     
  let property = state.properties.propertiesList.find(p => p.id === navigation.state.params.property.id);
  
  return {
      property: property,
      viewing: property.viewings.find(v => v.id === navigation.state.params.viewingId),
      user: state.user,
      network: state.network,
      goBack: navigation.state.params.goBack
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingScreen);


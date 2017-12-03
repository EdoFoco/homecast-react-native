import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import EditPropertyForm from '../../shared/EditPropertyForm';

class EditPropertyScreen extends Component{

  render() {
    
    return (
        <EditPropertyForm 
        user={this.props.user}
        property={this.props.property}
        updateProperty={this.props.updateProperty}
        user={this.props.user}/>
    )
  }
}

EditPropertyScreen.navigationOptions = {
  title: 'Edit Listing',
};

const mapStateToProps = (state, navigation) => {
    return {
        user: state.user,
        property: state.properties.propertiesList.find(p => p.id == navigation.navigation.state.params.property.id),
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertyScreen);

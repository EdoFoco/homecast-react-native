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
        property={this.props.property}/>
    )
  }
}

EditPropertyScreen.navigationOptions = {
  title: 'Edit Listing',
};

const mapStateToProps = (state, navigation) => {
    return {
        user: state.user,
        property: navigation.navigation.state.params.property,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPropertyScreen);

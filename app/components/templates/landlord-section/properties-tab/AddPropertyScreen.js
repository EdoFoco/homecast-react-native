import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TextInput
} from 'react-native';

class AddPropertyScreen extends Component{

  constructor(props) {
    super(props);
    this.state = { 
        showModal: false,
        selectedScraper: null,
        propertyId: null,
        errorText: null
     };
  }


  componentWillMount(){
    this.props.getScrapers();
  }

  _closeModal(){
    this.setState({showModal: false, selectedScraper: null, propertyId: null, errorText: null});
  }

  _importProperty(){
    if(this.state.propertyId){
      return this.props.importProperty(this.state.propertyId, this.props.user.info.id, this.state.selectedScraper.url)
        .then(() => {
          this.props.navigation.goBack();
        })
        .catch((e) => {
          if(e.response.status == 404){
            return this.setState({errorText: "We couldn't find a property with this id. \nMake sure you entered it correctly."})
          }
          console.error(e);
        });
    }
    else{
      this.setState({errorText: 'Please enter the property id.'})
    }
  }

  _renderScraperButton(scraper){
    let btnStyle = StyleSheet.flatten([styles.scraperButton, {backgroundColor: scraper.bgColor}])

    return(
      <View key={scraper.name} style={styles.scraperBtnContainer}>
          <TouchableHighlight style={btnStyle} onPress={() => {this.setState({showModal: true, selectedScraper: scraper})}}>
            <Text style={styles.scraperText}>Import from {scraper.name}</Text>
          </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scraperBtnContainer}>
            <TouchableHighlight style={styles.scraperButton}>
                <Text style={styles.scraperText}>Create New</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.divider} />
        {
          this.props.scrapers.map((scraper) => {
            return this._renderScraperButton(scraper)
          })
        }

        {
          !this.state.showModal ? null :
          <View style={styles.modalWrapper}>
              <TouchableHighlight style={styles.formOverlay} onPress={() => {this._closeModal()}}><Text></Text></TouchableHighlight>
              <View style={styles.formContainer} onPress={() => {console.log('do nothing')}}>
                  <Text style={styles.modalTitle}>{this.state.selectedScraper.name}</Text>
                  <Text style={styles.modalSubTitle}>Enter the property's id in the textbox. The id can be found in {this.state.selectedScraper.name}'s url (eg. 45908858 or chpk1050127)</Text>
                  <TextInput style={styles.modalInput} onChangeText={(value) => {this.setState({propertyId: value})}}/>
                  <TouchableHighlight style={StyleSheet.flatten([styles.modalButton, {backgroundColor: this.state.selectedScraper.bgColor}])} onPress={() => {this._importProperty()}}>
                      <Text style={styles.scraperText}>Import from {this.state.selectedScraper.name}</Text>
                  </TouchableHighlight>
                  <Text style={styles.errorText}>{this.state.errorText}</Text>
              </View>
          </View>
          
        }
      </View>
    )
  }
  
}

AddPropertyScreen.navigationOptions = {
  title: 'Add Property',
};

const mapStateToProps = (state) => {
     
    return {
        user: state.user,
        scrapers: state.scrapers.scrapers
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPropertyScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  scraperBtnContainer: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 40,
    height: 50,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
  },
  scraperButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.RED,
  },
  scraperText: {
    fontSize: FontSizes.DEFAULT,
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    width: Dimensions.get('window').width - 40,
    alignSelf: 'center'
  },
  modalWrapper: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
  },
  formOverlay: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height:  Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    alignSelf: 'center',
    height:  Dimensions.get('window').height - 200,
    width: Dimensions.get('window').width,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 20
  },
  modalTitle: {
    fontSize: FontSizes.TITLE,
    color: Colors.DARK_GREY,
  },
  modalSubTitle: {
    fontSize: FontSizes.SMALL_TEXT,
    color: Colors.LIGHT_GRAY,
  },
  modalInput: {
    borderWidth: 1,
    height: 50,
    marginTop: 20,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    paddingLeft: 5
  },
  modalButton: {
    height: 50,
    marginTop: 20,
    backgroundColor: Colors.RED,
    justifyContent: 'center'
  },
  errorText: {
    color: Colors.RED,
    fontSize: FontSizes.SMALL_TEXT,
    marginTop: 10
  }
});
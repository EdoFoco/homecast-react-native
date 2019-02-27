import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    TextInput,
    StyleSheet,
    View,
    Text,
    TouchableHighlight
  } from 'react-native';

export default class FiltersModal extends Component{

  constructor(props) {
    super(props);
    console.log(this.props.filters);
    this.state = {
       filters: {...this.props.filters}
    }
   }

  updateFilters(filter){
      var filters = {...this.state.filters};
      filters[filter.type] = filter.value;

      this.setState({filters: filters});
  }

  applyFilters(){
    this.props.getProperties(this.state.filters);
    this.props.updateFilters(this.state.filters);
    this.props.closeModal();
  }

  render() {
    return (
        <View style={styles.filtersModal}>
        <View style={styles.filterContainer}>
          <View style={styles.horizontalAlignWrapper}>
            <Text style={styles.filtersTitle}>Filters</Text>  
            <MCIcon name="window-close" style={styles.closeFiltersIcon} onPress={() => { this.props.closeModal() }}/>
          </View>
         </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filtersSubtitle}>Price</Text> 
          <View style={styles.horizontalAlignWrapper}>
            <TextInput style={styles.textInput}
                  value={ this.state.filters.minPrice ? this.state.filters.minPrice : null }
                  placeholder="min"
                  onChangeText={(text) => {this.updateFilters({type: 'minPrice', value: text})}}
                  keyboardType="numeric"
              />
              <TextInput style={styles.textInput}
                value={ this.state.filters.maxPrice ? this.state.filters.maxPrice : null  }
                placeholder="max"
                onChangeText={(text) => {this.updateFilters({type: 'maxPrice', value: text})}}
                keyboardType="numeric"
            />
          </View> 
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filtersSubtitle}>Number of bedrooms</Text> 
          <View style={styles.horizontalAlignWrapper}>
            <TouchableHighlight 
                style={this.state.filters.bedrooms ? styles.firstButtonInput : styles.firstButtonInputActive}
                onPress={(text) => {this.updateFilters({type: 'bedrooms', value: null})}}>
                    <Text style={this.state.filters.bedrooms ? styles.buttonInputText : styles.buttonInputTextActive}>Any</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bedrooms == 1 ? styles.buttonInputActive : styles.buttonInput}
                onPress={() => this.updateFilters({type: 'bedrooms', value: 1})}>
                    <Text style={this.state.filters.bedrooms == 1 ? styles.buttonInputTextActive : styles.buttonInputText}>1</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bedrooms == 2 ? styles.buttonInputActive : styles.buttonInput}
                onPress={() => this.updateFilters({type: 'bedrooms', value: 2})}>
                    <Text style={this.state.filters.bedrooms == 2 ? styles.buttonInputTextActive : styles.buttonInputText}>2</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bedrooms == 3 ? styles.buttonInputActive : styles.buttonInput}
                onPress={() => this.updateFilters({type: 'bedrooms', value: 3})}>
                    <Text style={this.state.filters.bedrooms == 3 ? styles.buttonInputTextActive : styles.buttonInputText}>3</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bedrooms > 3 ? styles.lastButtonInputActive : styles.lastButtonInput}
                onPress={() => this.updateFilters({type: 'bedrooms', value: 4})}>
                <Text style={this.state.filters.bedrooms > 3 ? styles.buttonInputTextActive : styles.buttonInputText}>4+</Text>
            </TouchableHighlight>
          </View> 
        </View>
        <View style={styles.filterContainer}>
          <Text style={styles.filtersSubtitle}>Number of bathrooms</Text> 
          <View style={styles.horizontalAlignWrapper}>
            <TouchableHighlight 
                style={this.state.filters.bathrooms ? styles.firstButtonInput : styles.firstButtonInputActive}
                onPress={() => this.updateFilters({type: 'bathrooms', value: null})}>
                <Text style={this.state.filters.bathrooms ? styles.buttonInputText : styles.buttonInputTextActive}>Any</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bathrooms == 1 ? styles.buttonInputActive : styles.buttonInput}
                onPress={() => this.updateFilters({type: 'bathrooms', value: 1})}>
                <Text style={this.state.filters.bathrooms == 1 ? styles.buttonInputTextActive : styles.buttonInputText}>1</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bathrooms == 2 ? styles.buttonInputActive : styles.buttonInput}
                onPress={() => this.updateFilters({type: 'bathrooms', value: 2})}>
                <Text style={this.state.filters.bathrooms == 2 ? styles.buttonInputTextActive : styles.buttonInputText}>1</Text>
            </TouchableHighlight>            
            <TouchableHighlight 
                style={this.state.filters.bathrooms == 3 ? styles.buttonInputActive : styles.buttonInput}
                onPress={() => this.updateFilters({type: 'bathrooms', value: 3})}>
                <Text style={this.state.filters.bathrooms == 3 ? styles.buttonInputTextActive : styles.buttonInputText}>1</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={this.state.filters.bathrooms > 3 ? styles.lastButtonInputActive : styles.lastButtonInput}
                onPress={() => this.updateFilters({type: 'bathrooms', value: 4})}>
                <Text style={this.state.filters.bathrooms >3 ? styles.buttonInputTextActive : styles.buttonInputText}>4+</Text>
            </TouchableHighlight>
          </View> 
        </View>
        <TouchableHighlight style={styles.applyFiltersButton} onPress={() => {this.applyFilters()}}>
          <Text style={styles.applyFiltersText}>Apply</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

// FiltersModal.propTypes ={
//    getProperties: PropTypes.func.isRequired,
//    updateFilters: PropTypes.func.isRequired,
//    closeModal: PropTypes.func.isRequired,
//    filters: PropTypes.object.isRequired
// }

const styles = StyleSheet.create({
    filtersModal: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        paddingTop: 40
      },
      closeFiltersIcon: {
        color: Colors.LIGHT_GRAY,
        fontSize: 30,
        alignSelf: 'flex-end',
        flex: 0.1
      },
      filtersTitle: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY,
        flex: 0.9
      },
      horizontalAlignWrapper: {
        flexDirection: 'row',
      },
      filterContainer: {
        marginTop: 30,
      },
      filtersSubtitle: {
        fontSize: FontSizes.MEDIUM_BIG,
        color: Colors.LIGHT_GRAY,
      },
      textInput: {
        borderWidth: 1,
        height: 50,
        flex: 0.5,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        padding: 5,
        borderRadius: 5,
        borderColor: Colors.LIGHT_GRAY
      },
      firstButtonInput: {
        marginTop: 10,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: 'white',
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        flex: 0.2,
        marginLeft: 10
      },
      firstButtonInputActive: {
        marginTop: 10,
        borderColor: Colors.AQUA_GREEN,
        backgroundColor: Colors.AQUA_GREEN,
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        flex: 0.2,
        marginLeft: 10
      },
      buttonInputActive: {
        marginTop: 10,
        borderColor: Colors.AQUA_GREEN,
        backgroundColor: Colors.AQUA_GREEN,
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.2
      },
      buttonInput: {
        marginTop: 10,
        borderColor: Colors.LIGHT_GRAY,
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.2
      },
      buttonInputText: {
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.MEDIUM_BIG,
        backgroundColor: 'rgba(0,0,0,0)'
    
      },
      buttonInputTextActive: {
        color: 'white',
        fontSize: FontSizes.MEDIUM_BIG,
        backgroundColor: 'rgba(0,0,0,0)'
      },
      lastButtonInputActive: {
        marginTop: 10,
        borderColor: Colors.AQUA_GREEN,
        backgroundColor: Colors.AQUA_GREEN,
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flex: 0.2,
        marginRight: 10
      },
      lastButtonInput: {
        marginTop: 10,
        borderColor: Colors.LIGHT_GRAY,
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flex: 0.2,
        marginRight: 10
      },
      applyFiltersButton: {
        backgroundColor: Colors.AQUA_GREEN,
        paddingRight: 20,
        paddingLeft: 20,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60
      },
      applyFiltersText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: FontSizes.MEDIUM_BIG
      },
     
})    

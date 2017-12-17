import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditPropertyActions from './EditPropertyActions';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {
    TextInput,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    View,
    Text,
    Dimensions
  } from 'react-native';

export default class AddViewingForm extends Component{

  constructor(props) {
    super(props);
    this.state = {
        isDatePickerVisible: false,
        isTimePickerVisible: false,
        viewingDateTime: new Date()
      };
    }

  _showDatePicker = () => this.setState({ isDatePickerVisible: true });
  _hideDatePicker = () => this.setState({isDatePickerVisible: false});
  
  _showTimePicker = () => this.setState({ isTimePickerVisible: true });
  _hideTimePicker = () => this.setState({isTimePickerVisible: false});
  
  _handleDatePicked = (date) => {
    date.setHours(this.state.viewingDateTime.getHours(), this.state.viewingDateTime.getMinutes());
    this.setState({viewingDateTime: date});
    this._hideDatePicker();
  };

  _handleTimePicked = (dateTime) => {
    let newDate = new Date(this.state.viewingDateTime.setTime(dateTime.getTime()));
    this.setState({viewingDateTime: newDate});
    this._hideTimePicker();
  };

  _cancelChanges(){
      this.setState({ isDatePickerVisible: false });
      this.setState({ isTimePickerVisible: false });
      this.props.showModal(false);
  }

  render() {
    return (
        <View style={styles.container}>
            
            {
                this.props.viewings.length == 0 ? null :
                <Text style={styles.noViewingsText}>
                    Add a viewing slots and start live streaming your flat.
                </Text>
            }
            
            {
                !this.props.isModalVisible ? null :
                <View style={styles.modalContainer}>
                    <TouchableHighlight style={styles.formOverlay} onPress={() => {this._cancelChanges()}}><Text></Text></TouchableHighlight>
                    <View style={styles.formContainer} onPress={() => {console.log('do nothing')}}>
                        <View style={styles.formWrapper}>
                            <Text style={styles.modalTitle}>Add a viewing</Text>
                            <Text style={styles.modalSubtitle}>Add a viewing slot to let people know when you will live stream this property.</Text>

                            <View style={styles.pickerContainer}>
                                <TouchableOpacity style={styles.pickerBtn} onPress={this._showDatePicker}>
                                    <FontAwesomeIcon name="calendar" style={styles.pickerIcon} /> 
                                    <Text style={styles.dateTimeText}>{this.state.viewingDateTime.toLocaleDateString("en-uk", { 
                                        weekday: "short", year: "numeric", month: "short", day: "numeric"
                                        })}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.pickerContainer}>
                                <TouchableOpacity style={styles.pickerBtn} onPress={this._showTimePicker}>
                                    <FontAwesomeIcon name="clock-o" style={styles.pickerIcon} /> 
                                    <Text style={styles.dateTimeText}>{this.state.viewingDateTime.toLocaleTimeString("en-uk", { 
                                        hour: "2-digit", minute: "2-digit" 
                                        })}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <DateTimePicker
                                isVisible={this.state.isDatePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDatePicker}
                                mode='date'
                                date={this.state.viewingDateTime}
                            />
                            <DateTimePicker
                                isVisible={this.state.isTimePickerVisible}
                                onConfirm={this._handleTimePicked}
                                onCancel={this._hideTimePicker}
                                mode='time'
                                date={this.state.viewingDateTime}
                            />
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableHighlight style={styles.saveButton} onPress={() => { this.props.createViewing() }}>
                                <Text style={styles.buttonTextLight}>Create Viewing</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
  }
}

AddViewingForm.PropTypes ={
    propertyId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    viewings: PropTypes.array.isRequired,
    isModalVisible: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        backgroundColor: 'white',
    },
    noViewingsText: {
        marginTop: 50,
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center',
        textAlign: 'center',
        margin: 20
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: Dimensions.get('window').width
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
        padding: 10,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        alignSelf: 'center',
        height:  Dimensions.get('window').height - 50,
        width: Dimensions.get('window').width,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    formWrapper: {
        backgroundColor: 'blue'
    },
    modalTitle: {
        color: Colors.DARK_GREY,
        fontSize: FontSizes.TITLE,
    },
    modalSubtitle: {
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.DEFAULT
    },
    pickerContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        width: Dimensions.get('window').width
    },
    pickerBtn: {
        flexDirection: 'row',
    },
    pickerIcon: {
        fontSize: 33,
        color: Colors.AQUA_GREEN,
        paddingTop: 5,
        marginRight: 20
    },
    dateTimeText: {
        fontSize: FontSizes.DEFAULT,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        padding: 5,
        paddingTop: 10,
        height: 50,
        width: Dimensions.get('window').width - 100,
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    actionsContainer:{
        position: 'absolute',
        bottom: 170,
        backgroundColor: 'pink'
    },
    cancelButton: {
        margin: 10,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderWidth: 1,
        height: 50,
        justifyContent: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        borderColor: Colors.LIGHT_GRAY,
        width: Dimensions.get('window').width - 20,
    },
    buttonTextDark:{
        color: Colors.DARK_GREY,
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center'
    },
    buttonTextLight:{
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center',
    },
    saveButton: {
        margin: 10,
        marginBottom: 0,
        backgroundColor: Colors.RED,
        height: 50,
        paddingRight: 20,
        paddingLeft: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 20
    }
})    

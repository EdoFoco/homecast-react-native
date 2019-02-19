import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { View, TouchableHighlight, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

export default class ViewingPicker extends Component{
    constructor(props){
        super(props);
        this.state = {
            viewingDateTime: new Date()
        }
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
    
    render(){
        return (
            <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.formOverlay} onPress={() => {this.props.close()}}><Text></Text></TouchableOpacity>
                    <View style={styles.formContainer}>
                        <View style={styles.formWrapper}>
                            <Text style={styles.modalTitle}>{this.props.title}</Text>
                            <Text style={styles.modalSubtitle}>{this.props.subTitle}</Text>

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
                            <TouchableOpacity style={styles.saveButton} onPress={() => { this.props.chooseDate(this.state.viewingDateTime) }}>
                                <Text style={styles.buttonTextLight}>{this.props.ctaText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        )
    }
}

ViewingPicker.PropTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    chooseDate: PropTypes.func.isRequired,
    ctaText: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: Dimensions.get('window').width,
        height:  Dimensions.get('window').height
    },
    formOverlay: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        height:  Dimensions.get('window').height,
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    formContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        alignSelf: 'center',
        height:  400,
        width: Dimensions.get('window').width,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        flex: 1
    },
    formWrapper: {
        flex: 0.8,
        margin: 10,
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
      //  width: Dimensions.get('window').width
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
        width: 300,
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    actionsContainer:{
        flex: 0.2,
        backgroundColor: Colors.AQUA_GREEN
    },
    buttonTextLight:{
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center',
    },
    saveButton: {
        backgroundColor: Colors.AQUA_GREEN,
        flex: 1, 
        justifyContent: 'center',
    },
});
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ViewingRow from './ViewingRow';
import FullScreenLoader from './FullScreenLoader';
import {
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    FlatList
  } from 'react-native';

export default class ManageViewingsForm extends Component{

  constructor(props) {
    super(props);
    this.state = {
        isDatePickerVisible: false,
        isTimePickerVisible: false,
        viewingDateTime: new Date(),
        isModalVisible: false,
        isLoading: false
      };
    }


  _showAddViewingModal(){
    this.setState({ isModalVisible: !this.state.isModalVisible });
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
      this._showAddViewingModal();
  }

  _createViewing(){
    let viewingInfo = {
        date_time: this.state.viewingDateTime
    }

    this.setState({isLoading: true});

    return this.props.createViewing(this.props.propertyId, this.props.userId, viewingInfo)
    .then(() => {
        return this._showAddViewingModal();
    })
    .then(() => {
        this.setState({isLoading: false});
    });
  }

  _renderRow = function({item}){
    let viewing = item;
    return (
        <ViewingRow viewing={viewing} goToViewing={(viewing) => { this.props.goToViewing(viewing)}} />
      )
  }

  render() {
    if(this.state.isLoading){
        return (
            <FullScreenLoader />
        )
    }
    return (
        <View style={styles.container}>
            {
                this.props.viewings.length == 0 ?
                <View style={{flex: 0.9}}>
                    <Text style={styles.noViewingsText}>
                        Add viewing slots and start live streaming your property.
                    </Text>
                </View>
                :
                <View style={{flex: 0.9}}>
                    <FlatList
                        extraData={this.props}
                        data={this.props.viewings}
                        renderItem={(viewing) => this._renderRow(viewing)}
                        keyExtractor={(item, index) => index.toString()}
                        removeClippedSubviews={false}
                    />
                </View>
                
            }

             <TouchableHighlight style={styles.addViewingButton} onPress={() => {this._showAddViewingModal()}}>
                 <Text style={styles.addViewingText}>Add Viewing</Text>
             </TouchableHighlight>
         
            
            {
                !this.state.isModalVisible ? null :
                <View style={styles.modalContainer}>
                    <TouchableHighlight style={styles.formOverlay} onPress={() => {this._cancelChanges()}}><Text></Text></TouchableHighlight>
                    <View style={styles.formContainer} onPress={() => {console.log('do nothing')}}>
                        <View style={styles.formWrapper}>
                            <Text style={styles.modalTitle}>Create a viewing slot</Text>
                            <Text style={styles.modalSubtitle}>Create a viewing slot to let people know when you will live stream this property.</Text>

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
                            <TouchableHighlight style={styles.saveButton} onPress={() => { this._createViewing() }}>
                                <Text style={styles.buttonTextLight}>Create Slot</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
  }
}

ManageViewingsForm.propTypes ={
    propertyId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    viewings: PropTypes.array.isRequired,
    createViewing: PropTypes.func.isRequired,
    gotToViewing: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
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
        backgroundColor: Colors.AQUA_GREEN,
        flex: 1, 
        justifyContent: 'center',
    },
    viewingRow:{
        flex: 1,
        alignSelf: 'stretch',
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomColor: Colors.LIGHT_GRAY,
        //borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      viewingDateCell: {
        width: 100,
        alignSelf: 'flex-start',
      },
      propertyName: {
        fontSize: FontSizes.DEFAULT,
        textAlign: 'left',
        flex: 1,
        paddingLeft: 10,
      },
      viewingTime:{
        flex: 0.7,
        fontSize: FontSizes.DEFAULT,
        textAlign: 'right',
        color: Colors.DARK_GREY,
        paddingRight: 10
      },
      viewingCapacity: {
          fontSize: FontSizes.DEFAULT,
          color: Colors.DARK_GREY
      },
      addViewingButton: {
        backgroundColor: Colors.AQUA_GREEN,
        flex: 0.1,
        justifyContent: 'center'
      },
      addViewingText: {
          color: 'white',
          textAlign: 'center',
          fontSize: FontSizes.DEFAULT
      },
})    

import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import GridView from 'react-native-super-grid';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PulseIndicator  } from 'react-native-indicators';
import StatusBox from '../../shared/StatusBox';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

class UploadPhotosScreen extends Component{

   constructor(props){
       super(props);
       this.state = {
         showSpinner: false,
         uploadPercentage: 0,
         isEditing: false,
         selectedImages: [],
         showStatusBox: false,
         statusBoxSuccess: true,
         statusBoxText: ''
       }
   }

  _updateProgress(progressEvent){
    this.setState({uploadPercentage: progressEvent.loaded / progressEvent.total * 100});
  }

  _cancelEditing(){
    this.setState({isEditing: false});
    this.setState({selectedImages: []})
    this.props.navigation.setParams({ isEditing : false });
  }

  _renderImagePicker(){
      ImagePicker.openPicker({
        width: 645,
        height: 430,
        cropping: true,
      }).then((image) => {
        this.setState({showSpinner: true});
        return this.props.uploadPropertyImage(this.props.user.info.id, this.props.property.id, image, (progressEvent) => {this._updateProgress(progressEvent)});
      })
      .catch((e) => {
          this.setState({showSpinner: false});
          console.error(e);
      })
      .then(() => {
        return this.setState({showSpinner: false});
       });
    }

  _renderSpinner(){
    return(
        <View style={styles.spinnerContainer}>
            <View style={styles.spinnerWindow}>
                <PulseIndicator color='blue' size={80} color={'rgba(38,166,154, 0.8)'}/>
                <Text style={{fontSize: FontSizes.MEDIUM_BIG, marginTop: 20}}>Uploading...</Text>
            </View>
        </View>
    )
  }

  _enterEditMode(image){
      this.setState({isEditing: !this.setState.isEditing});
      this._selectImage(image);
      this.props.navigation.setParams({ isEditing : this.state.isEditing });
  }

  _selectImage(image){
    if(this.state.isEditing){
        var selectedImages = [...this.state.selectedImages];
        var index = selectedImages.indexOf(image.id);
        if(index > -1){
            selectedImages.splice(index, 1);
        }
        else{
            selectedImages.push(image.id);
        }
        this.setState({selectedImages: selectedImages})
    }
  }

  _deleteImages(){
      this.props.deletePropertyImages(this.props.user.info.id, this.props.property.id, this.state.selectedImages)
      .then(() => {
          this._cancelEditing();
      })
      .catch((e) => {
          this.setState({statusBoxSuccess: false, statusBoxText: e.message, showStatusBox: true})
      });
  }

  _renderItem(item){
    return(
        <View style={styles.itemContainer}>
            <TouchableHighlight 
                style={styles.image} 
                onLongPress={() => {this._enterEditMode(item)}}
                onPress={!this.state.isEditing ? () => {} : () => {this._selectImage(item)}}>
                <View style={{flex: 1}}>
                    <FastImage
                        style={{flex: 1}}
                        source={{
                            uri: item.url,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {
                        this.state.isEditing && this.state.selectedImages.indexOf(item.id) > -1 ? 
                        <View style={styles.opaqueLayer}>
                            <MCIcon name="checkbox-marked" style={styles.checkboxIcon} />
                        </View> : null
                    } 
                   
                </View>
            </TouchableHighlight>
        </View>
    )
  }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.menuWrapper}>
                <TouchableHighlight style={styles.backButton} onPress={() => {this.props.navigation.goBack()}}>
                    <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
                </TouchableHighlight>
                <Text style={styles.menuText}>Media</Text>
                <TouchableHighlight style={{alignItems: 'flex-end', flex: 0.1 }}onPress={!this.state.isEditing ? () => { this._renderImagePicker()} : () => { this._cancelEditing()}}>
                    <MCIcon style={{fontSize: 30, color: Colors.AQUA_GREEN, marginRight: 10}} name={!this.state.isEditing ? 'plus' : 'close'} />
                </TouchableHighlight>
            </View>
            <GridView
                itemDimension={100}
                items={this.props.property.images}
                renderItem={item => (this._renderItem(item))}
                removeClippedSubviews={false}
            />
            {
                !this.state.isEditing ? null : 
                <TouchableHighlight style={styles.deleteImagesBtn} onPress={() => {this._deleteImages()}}><Text style={styles.deleteBtnText}>Delete</Text></TouchableHighlight>
            }
            {
                !this.state.showSpinner ? null :
                this._renderSpinner()
            }
            {
                !this.state.showStatusBox ? null :
                <StatusBox 
                close={() => {this.setState({showStatusBox: false})}}
                isSuccess={this.state.statusBoxSuccess}
                text={this.state.statusBoxText}
                />
            }
        </View>
    )
  }
}

UploadPhotosScreen.navigationOptions = ({ navigation }) => {
    return( { header: null });
};

const mapStateToProps = (state, navigation) => {
     
    return {
        user: state.user,
        property: state.properties.listings.find(p => p.id == navigation.navigation.state.params.property.id)
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadPhotosScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuText: {
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.MEDIUM_BIG,
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 5,
    flex: 0.8
  },
  backButton: {
    alignSelf: 'center',
    flex: 0.1
  },
  backButtonIcon: {
    fontSize: 45,
    color: Colors.AQUA_GREEN,
  },
  imageConatiner: {
    flex: 1
  },
  image: {
     flex: 1,
  },
  itemContainer: {
    borderRadius: 5,
    height: 100,
  },
  spinnerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: 200,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center'
  },
  spinnerWindow: {
      borderRadius: 5,
      width: 150,
      height: 150,
      backgroundColor: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10
  },
  statusBar: {
      height: 3,
      alignSelf: 'stretch',
      backgroundColor: 'purple'
  },
  progress: {
    height: 2,
    backgroundColor: Colors.AQUA_GREEN
  },
  deleteImagesBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      height: 60,
      backgroundColor: Colors.RED,
      justifyContent: 'center'
  },
  deleteBtnText: {
    color: 'white',
    fontSize: FontSizes.MEDIUM_BIG,
    alignSelf: 'center'
  },
  opaqueLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.4)'
  },
  checkboxIcon: {
      position: 'absolute',
      bottom: 1,
      right: 1,
      color: Colors.AQUA_GREEN,
      fontSize: FontSizes.TITLE
  },
  menuWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.DARK_BLUE,
    paddingTop: 20,
    alignItems: 'center',
  },
});
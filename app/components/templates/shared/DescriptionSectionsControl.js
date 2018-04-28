import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditPropertyActions from './EditPropertyActions';

import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableHighlight
  } from 'react-native';

export default class DescriptionSectionsControl extends Component{

  constructor(props) {
    super(props);

    this.state = {
        value: this.props.value
    }
   }

   componentWillUnmount(){
     let emptySectionIndex = this.props.property.description_sections.findIndex(s => s.title == "" && s.description == "");
     if(emptySectionIndex > -1){
        let sectionsClone = [...this.props.property.description_sections];
        sectionsClone.splice(emptySectionIndex, emptySectionIndex + 1);
        this.props.handleChange(sectionsClone);
     }
   }

   _handleSectionChange(index, section){
        let sectionsClone = [...this.props.property.description_sections];
        sectionsClone[index] = section;
        this.props.handleChange(sectionsClone);
   }

   _addDescriptionSection(){
        let sectionsClone = [...this.props.property.description_sections];
        sectionsClone.push({title: "", description: ""});
        this.props.handleChange(sectionsClone);
    }

   render() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.description}>{this.props.description}</Text>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionsTitle}>{`Sections`}</Text>
                <TouchableHighlight style={styles.addSectionBtn} onPress={() => {this._addDescriptionSection()}}>
                    <Text style={styles.addSectionTxt}>+</Text>
                </TouchableHighlight>
            </View>
            {
                this.props.property.description_sections.map((section, index) => {
                    return(
                        <View key={index}>
                            <Text style={styles.sectionKey}>Section {index + 1}</Text>
                            <Text style={styles.label}>Title</Text>
                            <TextInput 
                                style={styles.titleInput} 
                                value={section.title}
                                onChangeText={(text) => { this._handleSectionChange(index, {...section, title: text}) }} />
                            <Text style={styles.label}>Content</Text>
                            <TextInput style={styles.textInput}
                                multiline={true} 
                                value={section.description}
                                onChangeText={(text) => {this._handleSectionChange(index, {...section, description: text})}}
                            />
                        </View>
                    )
                })
            }
            
            <EditPropertyActions 
                property={this.props.property}
                updateProperty={this.props.updateProperty}
                cancelChanges={() => {this.props.cancelChanges()}}
                hideForm={() => {this.props.hideForm()}}
                enabled={true}
            />
        </ScrollView>
    )
  }
}

DescriptionSectionsControl.propTypes ={
    property: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    updateProperty: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired

}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    title: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY
    },
    description: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY,
    },
    titleInput: {
        paddingLeft: 10,
        marginTop: 5,
        height: 50,
        fontSize: FontSizes.DEFAULT,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        marginBottom: 10,
    },
    textInput: {
        paddingLeft: 10,
        marginTop: 5,
        height: 200,
        fontSize: FontSizes.DEFAULT,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10
    },
    addSectionBtn: {
        width: 40,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        marginTop: 10
    },
    addSectionTxt: {
        fontSize: 40,
        color: Colors.RED,
        alignSelf: 'center'
    },
    sectionsTitle: {
        fontSize: FontSizes.TITLE,
        marginTop: 20,
        alignSelf: 'flex-start',
        flex: 0.8
    },
    label: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY
    },
    sectionKey: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY,
        alignSelf: 'flex-end',
        marginTop: 10
    },
    sectionContainer: {
        flexDirection: 'row',
        flex: 1,
    }
})    

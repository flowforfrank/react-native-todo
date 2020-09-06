import React, { useState, useEffect } from 'react';
import { Appbar, TextInput } from 'react-native-paper';

import Storage from  '../Storage';

const Header = ({ addChecklist, selectedChecklist, navigator }) => {
    const [checklist, setChecklist] = useState(selectedChecklist);
    const [inputVisible, setInputVisible] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [text, setText] = useState('');
    const toggleInput = () => {
        setVisible(!visible);
        setText(selectedChecklist.name);
        setInputVisible(!inputVisible);
    };

    const editChecklist = async value => {
        checklist.name = value;

        setText(value);
        setChecklist(checklist);

        await Storage.rename(selectedChecklist.id, value);
    };

    const deleteChecklist = async () => {
        await Storage.remove(selectedChecklist.id);

        navigator.current.navigate("List");
    };

    useEffect(() => {
        setChecklist(selectedChecklist)

        return () => {
            setInputVisible(false);
        }
    }, [selectedChecklist]);

    return (
        <Appbar.Header style={{ paddingLeft: 20 }}>
            {inputVisible ?  
                <TextInput value={text} mode="outlined" style={{ height: 30, flexGrow: 1 }} onBlur={toggleInput} onChangeText={value => editChecklist(value)} /> :
                <Appbar.Content
                    title="Checklists"
                    titleStyle={{ fontFamily: 'Lora-Bold' }}
                    subtitle={checklist.name}
                    subtitleStyle={{ fontFamily: 'Lora-Regular', color: '#B180F6' }}
                    style={{ paddingLeft: 0 }}
                />
            }
            {selectedChecklist.name ? (
                <React.Fragment>
                    <Appbar.Action icon="pencil" onPress={toggleInput} color="#FFF" />
                    <Appbar.Action icon="delete-forever" onPress={deleteChecklist} color="#FFF" />
                </React.Fragment>
            ) :
                <Appbar.Action icon="plus-circle" onPress={addChecklist} />
            }
        </Appbar.Header>
    );
};

export default Header;
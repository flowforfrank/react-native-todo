import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button, Checkbox, List, IconButton, Modal, Portal, Provider, TextInput } from 'react-native-paper';

import Storage from  '../Storage';

const styles = StyleSheet.create({
    regular: {
        fontFamily: 'Lora-Regular'
    },
    bold: {
        fontFamily: 'Lora-Bold'
    },
    remaining: {
        color: '#888888'
    },
    year: {
        fontSize: 16
    },
    strikeThrough: {
        textDecorationLine: 'line-through',
        color: '#888'
    },
    statusBar: {
        backgroundColor: '#FFF',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'space-between'
    }
});

const Details = ({ route, refreshChecklist }) => {
    const [checklist, updateChecklist] = useState(route.params);
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const [itemID, setItemID] = useState(0);
    
    const hideModal = () => setVisible(false);
    const showModal = item => {
        setItemID(item.id)
        setText(item.name);
        setVisible(true);
    };

    useEffect(() => {
        return async () => {
            await refreshChecklist();
        }
    }, []);

    const StatusBar = ({ total, remaining, date }) => (
        <View style={styles.statusBar}>
            <View>
                <Text style={styles.regular}>{total} items</Text>
                <Text style={[styles.regular, styles.remaining]}>{remaining} remaining</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.bold, styles.year]}>{date.year}</Text>
                <Text style={styles.regular}>{date.monthAndDay}</Text>
            </View>
        </View>
    );

    const updateData = async () => {
        updateChecklist({...checklist});
        
        await Storage.set(checklist);
    } 

    const addTodo = () => {
        checklist.items.unshift({
            id: ((checklist.items[0] || {}).id + 1) || 0,
            name: `Todo #${checklist.items.length + 1}`,
            checked: false
        });

        updateData();
    };

    const markTodo = id => {
        checklist.items = checklist.items.map(item => {
            if (item.id === id) {
                item.checked = !item.checked;
            }

            return item;
        });

        updateData();
    };

    const editTodo = value => {
        setText(value);

        checklist.items = checklist.items.map(item => {
            if (item.id === itemID) {
                item.name = value;
            }

            return item;
        });

        updateData();
    };

    const deleteTodo = id => {
        checklist.items = checklist.items.filter(item => item.id !== id);

        updateData();
    };

    return (
        <Provider>
            <StatusBar date={checklist.date} total={checklist.items.length} remaining={checklist.items.filter(item => !item.checked).length} />
            <ScrollView>
                {checklist.items.map((item, index) => (
                    <List.Item
                        key={index}
                        title={item.name}
                        titleStyle={[styles.regular, item.checked ? styles.strikeThrough : { color: '#FFF' }]}
                        onPress={() => showModal(item)}
                        left={() => (
                            <View style={{ justifyContent: 'center' }}>
                                <Checkbox status={item.checked ? 'checked' : 'unchecked'} onPress={() => markTodo(item.id)} uncheckedColor="#FFF" color="#FFF" />
                            </View>
                        )}
                        right={() => <IconButton icon="close-circle-outline" color="#FFF" onPress={() => deleteTodo(item.id)} /> }
                    />
                ))}
            </ScrollView>
            <View style={{ margin: 15 }}>
                <Button mode="contained" style={{ borderRadius: 0 }} labelStyle={styles.bold} onPress={addTodo}>Add todo</Button>
            </View>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ backgroundColor: '#FFF', margin: 15 }}>
                    <TextInput label="Todo's name" value={text} onChangeText={value => editTodo(value)} />
                </Modal>
            </Portal>
        </Provider>
    );
};

export default Details;
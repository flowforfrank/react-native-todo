import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button, List } from 'react-native-paper';

const styles = StyleSheet.create({
    regular: {
        fontFamily: 'Lora-Regular'
    },
    bold: {
        fontFamily: 'Lora-Bold'
    },
    list: {
        margin: 15
    },
    listItem: {
        backgroundColor: '#FFF',
        marginBottom: 15
    },
    listItemIcon: {
        marginLeft: 0
    },
    date: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginRight: 10
    },
    button: {
        borderRadius: 0
    }
});

const Checklist = ({ list, addChecklist, navigation, refreshHeader }) => {
    const AddButton = () => <Button mode="contained" style={styles.button} labelStyle={styles.bold} onPress={addChecklist}>Add More Lists</Button>;
    const Date = ({ date }) => (
        <View style={styles.date}>
            <Text style={styles.bold}>{date.year}</Text>
            <Text style={styles.regular}>{date.monthAndDay}</Text>
        </View>
    );

    if (!list.length) {
        return (
            <View style={styles.list}>
                <AddButton />
            </View>
        );
    }

    const checklists = list.map((checklist, index) => (
        <List.Item
            key={index}
            style={styles.listItem}
            title={checklist.name}
            titleStyle={styles.bold}
            description={`${checklist.items.filter(item => !item.checked).length} item(s) remaining`}
            descriptionStyle={styles.regular}
            onPress={() => {
                refreshHeader(checklist);
                navigation.navigate('Details', checklist);
            }}
            left={() => <List.Icon style={styles.listItemIcon} icon={require('../assets/checklist-icon.png')} />}
            right={() => <Date date={checklist.date} />}
        />
    ));

    return (
        <React.Fragment>
            <ScrollView style={styles.list}>
                {checklists}
            </ScrollView>
            <View style={styles.list}>
                <AddButton />
            </View>
        </React.Fragment>
    );
};

export default Checklist;
import React, { useState, useEffect } from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Header from './components/Header';
import List from './components/List';
import Details from './components/Details';

import Storage from  './Storage';

const Stack = createStackNavigator();

export default function App() {
    const navigationRef = React.createRef();
    const [data, updateData] = useState({
        allChecklists: [],
        selectedChecklist: {}
    });
    const [fontsLoaded] = useFonts({
        'Lora-Regular': require('./assets/fonts/Lora-Regular.ttf'),
        'Lora-Bold':    require('./assets/fonts/Lora-Bold.ttf')
    });

    const refreshHeader = checklist => {
        updateData({
            allChecklists: data.allChecklists,
            selectedChecklist: checklist
        });
    };

    const refreshChecklist = async () => {
        updateData({
            allChecklists: await Storage.get(),
            selectedChecklist: {}
        });
    };
    
    const addChecklist = async () => {
        await Storage.add();

        updateData({
            allChecklists: await Storage.get(),
            selectedChecklist: {}
        });
    };
    
    useEffect(() => {
        const getChecklist = async () => {
            const checklistResponse = await Storage.get();
            
            updateData({
                allChecklists: checklistResponse,
                selectedChecklist: {}
            });
        };
       
        getChecklist();
    }, []);

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        const WrappedList = props => <List list={data.allChecklists} addChecklist={addChecklist} refreshHeader={refreshHeader} {...props} />;
        const WrappedDetails = props => <Details refreshChecklist={refreshChecklist} {...props} />

        return (
            <React.Fragment>
                <Header addChecklist={addChecklist} selectedChecklist={data.selectedChecklist} navigator={navigationRef} />
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Constants.manifest.backgroundColor } }}>
                        <Stack.Screen name="List" component={WrappedList} />
                        <Stack.Screen name="Details" component={WrappedDetails} />
                    </Stack.Navigator>
                </NavigationContainer>
            </React.Fragment>
        );
    }
};
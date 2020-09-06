import AsyncStorage from '@react-native-community/async-storage';

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const Storage = {
    async get() {
        try {
            const json = await AsyncStorage.getItem('@data');

            return json != null ? JSON.parse(json) : [];
        } catch(e) {
            // Error reading value
        }
    },

    async set(checklist) {
        try {
            const currentState = await this.get();
            const newState = currentState.map(state => checklist.id === state.id ? checklist : state);

            await AsyncStorage.setItem('@data', JSON.stringify(newState));
        } catch (e) {
            // Saving error
        }
    },

    async rename(id, checklistName) {
        try {
            const currentState = await this.get();
            const newState = currentState.map(state => {
                if (state.id === id) {
                    state.name = checklistName;
                }

                return state;
            });

            await AsyncStorage.setItem('@data', JSON.stringify(newState));
        } catch (e) {
            // Saving error
        }
    },

    async add() {
        try {
            const state = await this.get();
            const date = new Date();
            const month = monthNames[date.getMonth()];
            const day = ('0' + date.getDate()).slice(-2);
            
            state.unshift({
                id: ((state[0] || {}).id + 1) || 0,
                name: 'New List',
                date: {
                    year: date.getFullYear(),
                    monthAndDay: `${month} ${day}`
                },
                items: []
            });

            await AsyncStorage.setItem('@data', JSON.stringify(state));
        } catch (e) {
            // Saving error
        }
    },

    async remove(id) {
        try {
            const currentState = await this.get();
            const newState = currentState.filter(state => state.id !== id);

            await AsyncStorage.setItem('@data', JSON.stringify(newState));
        } catch (e) {
            // Saving error
        }
    }
};

export default Storage;
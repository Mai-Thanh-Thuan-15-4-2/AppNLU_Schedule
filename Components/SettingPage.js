import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors, loadPage } from '../BaseStyle/Style';
// import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';

import Icon from 'react-native-vector-icons/FontAwesome5';
const SettingPage = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [selectedItem, setSelectedItem] = useState(15);
    const [listTime, setListTime] = useState([]);

    const timeArray = [5, 10, 15, 20, 25, 30];
    useEffect(() => {
        const fetchTimes = () => {
            const listTimeFomat = timeArray.map(time => ({
                label: `${time} phút`,
                value: time,
            }));

            setListTime(listTimeFomat);
        };
        fetchTimes();
 



    }, []);

    const handleTimeChange = (time) => {
        setSelectedItem(time);
        console.log(time)
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <View style={styles.item_text}>
                    <Icon name='bell' style={styles.bell_icon} />
                    <Text style={{ fontSize: 18 }}>Thông báo nhắc nhở</Text>
                </View>
                <Switch
                    trackColor={{ false: '#767577', true: colors.primary }}
                    thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            <View style={styles.item}>
                <View style={styles.item_text}>
                    <Icon name='clock' style={styles.bell_icon} />
                    <Text style={{ fontSize: 18 }}>Thông báo trước</Text>
                </View>
                <Dropdown
                    style={styles.dropdown}
                    data={listTime}
                    labelField="label"
                    valueField="value"
                    placeholder="Chọn học kỳ"
                    value={selectedItem}
                    onChange={(item) => handleTimeChange(item.value)}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    item_text: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
        fontSize: 16,
    },
    item_sub: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    subItem: {
        marginRight: 8,
        alignItems: 'center',
    },
    bell_icon: {
        marginRight: 8,
        fontSize: 30,
        color: colors.primary,
    },
    smallText: {
        fontSize: 12, // Kích thước chữ nhỏ
        color: 'gray', // Màu chữ khác
    },
    toggleButton: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleIcon: {
        color: 'white',
        fontSize: 20, 
    },
    dropdown: {
        width: '30%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
});

export default SettingPage;

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { colors, loadPage } from '../BaseStyle/Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../service/NLUAppApiCaller';
import User from '../model/User';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Text } from 'react-native-elements';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const sendToGPT = async (message) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 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',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: message
            }],
        }),
    });
    const data = await response.json();

    if (data) {
        const value = data?.choices[0]?.message?.content;
        return value;
    }
    return "Lỗi rồi!!!";
};

const ChatGPT = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAnwsering, setIsAnwsering] = useState(false);
    const [user, setUser] = useState(new User('', '', true, false, null, ''));
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const dot1Opacity = useRef(new Animated.Value(0)).current;
    const dot2Opacity = useRef(new Animated.Value(0)).current;
    const dot3Opacity = useRef(new Animated.Value(0)).current;

    const fadeInFadeOut = (animatedValue) => {
        return Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ]);
    };

    const getTypingAnimation = () => {
        return Animated.loop(Animated.parallel([
            fadeInFadeOut(dot1Opacity),
            Animated.sequence([
                Animated.delay(250),
                fadeInFadeOut(dot2Opacity),
            ]),
            Animated.sequence([
                Animated.delay(500),
                fadeInFadeOut(dot3Opacity),
            ]),
        ]));
    };

    const typingAnimation = getTypingAnimation();

    useEffect(() => {
        setIsLoading(true);
        AsyncStorage.getItem('id').then(id => {
            getUser(id).then(u => {
                setUser(u);
            })
        })
        setIsLoading(false);
    }, []);

    const messageItem = ({ item, index }) => {
        let style = index % 2 == 0 ? styles.questionMessage : styles.anwserMessage;
        return (
            <View style={[style, styles.message]}>
                <Text>{item}</Text>
            </View>
        )
    }

    const sendQuestion = () => {
        setInputText(inputText.trim());
        if (inputText !== '') {
            addMessages(inputText);
            setIsAnwsering(true);
            typingAnimation.start()
            sendToGPT(inputText).then(response => {
                setIsAnwsering(false);
                typingAnimation.stop()
                addMessages(response)
            });
            setInputText('');
        }

    }

    const addMessages = (newMessage) => {
        setMessages(oldMesages => [...oldMesages, newMessage]);
    }

    return (
        <>{user.isVip ? (
            <View style={styles.container}>
                <FlatList data={messages} keyExtractor={(item, index) => index.toString()} renderItem={messageItem} />
                {isAnwsering ? (
                    <View style={[styles.anwserMessage, styles.message, { flexDirection: 'row' }]}>
                        <Animated.Text style={[styles.dot, { opacity: dot1Opacity }]}>.</Animated.Text>
                        <Animated.Text style={[styles.dot, { opacity: dot2Opacity }]}>.</Animated.Text>
                        <Animated.Text style={[styles.dot, { opacity: dot3Opacity }]}>.</Animated.Text>
                    </View>) : (<></>)}
                <View style={styles.inputArea}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder='Viết gì đó ...' multiline={true} value={inputText} onChangeText={text => setInputText(text)} />
                        <TouchableOpacity style={styles.submitButton} onPress={sendQuestion}>
                            <Icon style={{ color: 'white', }} name="send" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>) : (
            <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Chức năng chỉ dành cho VIP</Text>
                <Text style={{ fontSize: 15, color: 'gray' }}>Nạp lần đầu đi bạn eiii</Text>
            </View>
        )
        }


            {isLoading ? (
                <View style={loadPage.loadingContainer}>
                    <ActivityIndicator size="large" color="#2bc250" />
                </View>) : (<></>)
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    inputArea: {
        paddingBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#bebebe',
        borderRadius: 10,
        backgroundColor: colors.white,
    },
    input: {
        flex: 9,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#19c37d',
        margin: 3,
        justifyContent: 'center',
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    message: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%'
    },
    questionMessage: {
        alignSelf: 'flex-end',
        backgroundColor: 'white',
    },
    anwserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#19c37d',
    },
    dot: {
        fontSize: 24,
        marginHorizontal: 5,
    },

});

export default ChatGPT;
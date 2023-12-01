import React, { useState, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { Text, StyleSheet, View, TextInput,  TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity, FlatList} from 'react-native';
import { LoginDefault, getResultRegister, getSubjectClass, registerSubject } from '../service/NLUApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { getUser } from '../service/NLUAppApiCaller';
import User from '../model/User';
import SubjectClass from '../model/SubjectClass';

export default function RegisterClass() {
    const [subjectClassAll, setSubjectClassAll] = useState([]);
    const [classChosen, setClassChosen] = useState([]);
    const [subjectClasses, setSubjectClasses] = useState([]);
    const [resultRegister, setResultRegister] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(new User('', '', true, false, null, ''));
    const [subjectClassDetails, setSubjectClassDetails] = useState(new SubjectClass('', '', '', '', '', '', '', '', '', '', '', ''));
    const bottomSheetRef = useRef(null);
    const detailsBSRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        getSubjectClass().then((val) => {
            if (val) {
                setSubjectClassAll(val);
                setSubjectClasses(val);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Có lỗi xảy ra!',
                    text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
                    visibilityTime: 2000,
                    autoHide: true,
                });
            }
        });
        getResultRegister().then(vals => {
            if (vals) setResultRegister(vals);
        })
        AsyncStorage.getItem('id').then(id => {
            getUser(id).then(u => {
                setUser(u);
            })
        })
        setIsLoading(false);
    }, []);

    const unchoose = (id) => {
        const unchosen = classChosen.filter(item => item.id !== id);
        setClassChosen(unchosen);
    }

    const choose = (item) => {
        setIsLoading(true);
        const isContain = classChosen.some(obj => obj.id === item.id);
        const isRegistered = resultRegister.some(obj => obj.idSubject === item.idSubject);
        const isContainSubject = classChosen.some(obj => obj.idSubject === item.idSubject);
        const isRemain = (item.remain > 0);
        setIsLoading(false);
        if (isContain) {
            unchoose(item.id);
            return;
        }
        if (isRegistered) {
            Toast.show({
                type: 'error',
                text1: 'Bạn đã đăng ký môn này rồi!',
                text2: 'Có 1 môn mà đăng ký gì mấy lần vậy nhỉ :v',
                visibilityTime: 2000,
                autoHide: true,
            });
            return;
        }
        if (isContainSubject) {
            Toast.show({
                type: 'error',
                text1: 'Bạn đã chọn môn này rồi!',
                text2: 'Hỏng lẽ bạn muốn học 1 môn 2 ngày :v',
                visibilityTime: 2000,
                autoHide: true,
            });
            return;
        }
        if (isRemain) {
            Toast.show({
                type: 'error',
                text1: 'Hết slot rồi bạn eiii!',
                text2: 'Đời mà! Nhanh tay thì còn chậm tay thì mất :))',
                visibilityTime: 2000,
                autoHide: true,
            });
            return;
        }
        const newClassChosen = [...classChosen, item]
        setClassChosen(newClassChosen);
    }

    const doSearch = (text) => {
        const data = subjectClassAll.filter(item => item.idSubject.indexOf(text) !== -1 || item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        setSubjectClasses(data);
    }

    const SubjectDetails = ({ subjectClass }) => {
        return (
            <BottomSheetView>
                <View style={{ flexDirection: 'column', width: '95%', alignSelf: 'center', }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{subjectClass.name} ({subjectClass.idSubject})</Text>
                    <View style={[styles.rowDetails, { backgroundColor: 'lightgray', borderTopLeftRadius: 10, borderTopRightRadius: 10}]}>
                        <Text style={styles.textDetails}>Nhóm: {subjectClass.group}</Text>
                        <Text style={styles.textDetails}>Số TC: {subjectClass.numCredit}</Text>
                    </View>
                    <View style={[styles.rowDetails, { backgroundColor: '#eeeeee' }]}>
                        <Text style={styles.textDetails}>Thứ: {subjectClass.day}</Text>
                        <Text style={styles.textDetails}>Tiết BD: {subjectClass.startLesson}</Text>
                        <Text style={styles.textDetails}>Số tiết: {subjectClass.numLesson}</Text>
                    </View>
                    <View style={[styles.rowDetails, { backgroundColor: 'lightgray'}]}>
                        <Text style={styles.textDetails}>Số lượng: {subjectClass.numStudent}</Text>
                        <Text style={styles.textDetails}>Còn lại: {subjectClass.remain}</Text>
                    </View>
                    <View style={[styles.rowDetails, { backgroundColor: '#eeeeee', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}]}>
                        <Text style={[styles.textDetails,]}>Chi tiết: {subjectClass.schedule}</Text>
                    </View>
                </View>
            </BottomSheetView>
        )
    }

    const classItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                setSubjectClassDetails(item);
                detailsBSRef.current.snapToIndex(1);
            }}>
                <View style={styles.row}>
                    <Text style={[styles.cell, { flex: 0.18, textAlign: 'center' }]}>{item.idSubject}</Text>
                    <Text style={[styles.cell, { flex: 0.57 }]}>{item.name}</Text>
                    <Text style={[styles.cell, { flex: 0.15, textAlign: 'center' }]}>{item.group}</Text>
                    <TouchableOpacity style={[styles.cell, { flex: 0.10, }]} onPress={() => unchoose(item.id)}>
                        <Icon style={{ color: 'black', }} name="trash-outline" color='black' size={20} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    const bottomSheetItem = ({ item }) => {
        const isContain = classChosen.some(obj => obj.id === item.id)
        let bgColor = '#f3f3f3'
        if (isContain) bgColor = 'green'
        return (
            <TouchableOpacity style={[styles.bottomSheetItem, { backgroundColor: bgColor }]} onPress={() => choose(item)}>
                <View style={{ flexDirection: 'column', width: '100%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.cell, { flex: 0.7, color: 'red' }]}>{item.name} ({item.idSubject})</Text>
                        <Text style={[styles.cell, { flex: 0.3, textAlign: 'center', color: '#2196F3' }]}>Nhóm: {item.group}</Text>
                    </View>
                    <View>
                        <Text style={{ flex: 1, fontStyle: 'italic', }}>TKB: {item.schedule}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const startRegister = async () => {
        if (classChosen.length<1) {
            Toast.show({
                type: 'error',
                text1: 'Đã chọn môn nào đâu mà đăng ký! hmmm...',
                text2: 'Chọn vài môn đeeee',
                visibilityTime: 3000,
                autoHide: true,
            });
            return;
        }
        setIsLoading(true);
        let res = []
        await LoginDefault();
        for (let i = 0; i<classChosen.length;i++){
            let result = await registerSubject(classChosen[i].id);
            if (result == null) {
                Toast.show({
                    type: 'error',
                    text1: 'Có lỗi gì đó rồi á!',
                    text2: 'Thử tắt mở lại xem, biết đâu lại được :v',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                res.push(classChosen[i])
                continue;
            }
            if (result === true) {
                Toast.show({
                    type: 'info',
                    text1: 'Đăng ký xong 1 môn nè!',
                    text2: classChosen[i].name,
                    visibilityTime: 3000,
                    autoHide: true,
                });
            } else if (result === false) {
                Toast.show({
                    type: 'info',
                    text1: 'Hủy xong 1 môn nè!',
                    text2: classChosen[i].name,
                    visibilityTime: 3000,
                    autoHide: true,
                });
            } if (result == 'Cảnh báo: tài khoản của bạn không được đăng ký/hủy đăng ký ở thời điểm hiện tại.'){
                Toast.show({
                    type: 'error',
                    text1: 'Ngoài thời gian đăng ký môn học á bạn -_-',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                setIsLoading(false);
                return;
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Có lỗi gì đó!',
                    text2: result,
                    visibilityTime: 3000,
                    autoHide: true,
                });
                res.push(classChosen[i])
            }
        }
        setIsLoading(false);
        Toast.show({
            type: 'success',
            text1: 'Xong hết rồi nè bạn eiii! ('+(classChosen.length-res.length)+'/'+classChosen.length+')',
            text2: 'Có ' + res.length + ' môn đăng ký không thành công!',
            visibilityTime: 20000,
            autoHide: false,
        });
        
        return res;
    }

    return (
        <>{user.isVip ?
            (<TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <View style={styles.container}>
                    <View style={styles.table}>
                        <View style={styles.headerPane}>
                            <View style={styles.headerRow}>
                                <Text style={[styles.header, { flex: 0.18, textAlign: 'center' }]}>Mã</Text>
                                <Text style={[styles.header, { flex: 0.57 }]}>Tên môn</Text>
                                <Text style={[styles.header, { flex: 0.15, textAlign: 'center' }]}>Nhóm</Text>
                                <Text style={[styles.header, { flex: 0.10, textAlign: 'center' }]}></Text>
                            </View>
                        </View>
                        <View style={styles.tablePane}>
                            {classChosen.length > 0 ?
                                (<FlatList data={classChosen} keyExtractor={item => item.id} renderItem={classItem} />)
                                : (<View style={[styles.row,]}>
                                    <Text style={{ textAlign: 'center', flex: 1, color: 'gray' }}>Không có môn học nào được chọn</Text>
                                </View>)}

                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.button, { minWidth: '60%', backgroundColor: 'white', marginTop: 5}]} onPress={() => bottomSheetRef.current.expand()}>
                                <Text style={[styles.buttonTitle, { color: '#2196F3' }]}>Thêm môn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2bc250" />
                        </View>) : (<></>)
                    }

                    <View style={styles.startButtonBlock}>
                        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={()=>startRegister()}>
                            <Text style={styles.buttonTitle}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={['1%','50%', '75%', '100%']} enablePanDownToClose={true} >
                        <View style={styles.searchContainer}>
                            <View style={styles.searchBlock}>
                                <TextInput style={styles.searchInput} placeholder='Nhập tên môn hoặc mã môn' placeholderTextColor={'lightgray'} onChangeText={(text) => doSearch(text)} />
                                <TouchableOpacity style={styles.searchButton} onPress={() => { }}>
                                    <Icon style={{ color: 'lightgray', }} name="search" size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <BottomSheetFlatList
                            data={subjectClasses}
                            keyExtractor={(item) => item.id}
                            renderItem={bottomSheetItem}
                            contentContainerStyle={styles.contentContainer}
                        />
                    </BottomSheet>
                    <BottomSheet ref={detailsBSRef} snapPoints={['1%','35%', '60%']} enablePanDownToClose={true}>
                        <SubjectDetails subjectClass={subjectClassDetails} />
                    </BottomSheet>
                </View>

            </TouchableWithoutFeedback>)
            : (
                <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Chức năng chỉ dành cho VIP</Text>
                    <Text style={{ fontSize: 15, color: 'gray' }}>Nạp lần đầu đi bạn eiii</Text>
                </View>
            )}
        </>


    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#2bc250',
        height: '100%',
        alignItems: 'center'
    },
    table: {
        width: '95%',
        marginHorizontal: 'auto',
        marginTop: 10,
    },
    headerPane: {

    },
    headerRow: {
        flexDirection: 'row'
    },
    header: {
        fontWeight: 'bold',
        paddingRight: 5
    },
    tablePane: {
        maxHeight: '95%'
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
    },
    cell: {
        paddingRight: 5
    },
    button: {
        backgroundColor: '#2196F3',
        width: 'auto',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    startButtonBlock: {
        width: '80%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: '10%'
    },
    startButton: {
        width: '100%',

    },
    buttonTitle: {
        fontWeight: 'bold',
        color: 'white',
        // textAlign: 'center'
    },
    bottomSheetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    searchContainer: {
        width: '100%',
        alignItems: 'center',
    },
    searchBlock: {
        flexDirection: 'row',
        width: '95%',
        alignItems: 'center',
        marginHorizontal: 'auto',
        borderColor: 'lightgray',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginVertical: 5,
    },
    searchInput: {
        flex: 1,
    },
    searchButton: {

    },
    rowDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    textDetails: {
        fontSize: 15,

    },

    loadingContainer: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: '#bec4c2',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: 0 }],
        width: 150,
        height: 150,
        justifyContent: 'center',
        borderRadius: 10,
        opacity: 0.8,
    }
})
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { getExams, getSemesters } from '../service/NLUApiCaller';
import { loadPage } from '../BaseStyle/Style';
import { colors } from 'react-native-elements';

const ExamsSchedule = () => {
    const [listSemester, setlistSemester] = useState([]);
    const [examData, setExamData] = useState([]);
    const [selectedIdSemester, setSelectedIdSemester] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleSemesterChange = async (id) => {
        setSelectedIdSemester(id);
        // setIsLoading(true);
    
        try {
          const data = await getExams(id);
          setExamData(data);
        } catch (error) {
          console.error(error);
         
        }
        
      };
    function DateToString(date) {
        // Kiểm tra nếu đối tượng date không phải là đối tượng Date
        if (!(date instanceof Date)) {
            throw new Error('Invalid Date object');
        }

        // Lấy thông tin ngày, tháng và năm từ đối tượng Date
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Thêm 0 ở đầu nếu tháng < 10
        const day = date.getDate().toString().padStart(2, '0'); // Thêm 0 ở đầu nếu ngày < 10

        // Kết hợp thành chuỗi ngày/tháng/năm
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    }
    const displayExams = () => {
        if (!examData || examData.length === 0) {
            return <Text>No exams available</Text>;
          }
      
        return (
            <FlatList
                data={examData}
                style={styles.examList}
                keyExtractor={(exam) => exam.numOrder.toString()}
                renderItem={({ item: exam }) => (
                    <View key={exam.numOrder} style={styles.examItem}>
                        <Text>
                            <Text style={styles.boldText}>{exam.name}</Text> ({exam.id}){'\n'}
                            Phòng thi: {exam.examRoom}{'\n'}
                            Ngày thi: {DateToString(exam.testDay)}{'\n'}
                            Tiết BĐ: {exam.lessonStart}{'\n'}
                            Số tiết: {exam.numOfLesson}{'\n'}
                            Hình thức thi: {exam.examForm}{'\n'}
                        </Text>
                    </View>
                )}
            />
        );
    };
    const reloadPage = async () => {
        console.log("lịch thi theo học kỳ")
    };

    /* Dropdown */
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const semesters = await getSemesters();

                const formattedListSemester = semesters.map(semester => ({
                    label: `${semester.name}`,
                    value: semester.id,
                }));
                setlistSemester(formattedListSemester);
            } catch (error) {
               
            }
        };

        fetchSemesters();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.container_ses}>
                <Dropdown
                    style={styles.dropdown}
                    data={listSemester}
                    labelField="label"
                    valueField="value"
                    placeholder="Chọn học kỳ"
                    value={selectedIdSemester}
                    onChange={(item) => handleSemesterChange(item.value)}
                />
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={reloadPage}
                >
                    <Icon name="ios-refresh" size={24} color="black" />
                </TouchableOpacity>
            </View>


            <View style={styles.examList}>
                {displayExams()}
            </View>
            {isLoading ? (
                <View style={loadPage.loadingContainer}>
                    <ActivityIndicator size="large" color="#2bc250" />
                </View>) : (<></>)
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    container_ses: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    examList: {
        marginTop: 15,
        marginBottom: 15,
        width: '100%',
    },
    examItem: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    nameSubjectStyle: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    dropdown: {
        marginTop: 5,
        width: '90%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ExamsSchedule;

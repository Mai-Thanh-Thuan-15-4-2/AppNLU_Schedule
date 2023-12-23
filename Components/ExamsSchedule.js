import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { getExams, getSemesters } from '../service/NLUApiCaller';
import { loadPage, colors } from '../BaseStyle/Style';
import moment from 'moment/min/moment-with-locales';

const ExamsSchedule = () => {
    const [listSemester, setlistSemester] = useState([]);
    const [examData, setExamData] = useState([]);
    const [selectedIdSemester, setSelectedIdSemester] = useState(null);
    const [currentSemester, setCurrentSemester] = useState(null);
    const [isLoading, setIsLoading] = useState(false);



    const handleSemesterChange = async (id) => {
        setSelectedIdSemester(id);
        setIsLoading(true);

        try {
            const data = await getExams(id);
            setExamData(data);
        } catch (error) {
            console.error(error);

        }
        setIsLoading(false)
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
            return <Text>Không có lịch thi nào ở học kỳ đã chọn!</Text>;
        }

        return (
            <FlatList
                data={examData}
                style={styles.examList}
                keyExtractor={(exam) => exam.numOrder.toString()}
                renderItem={({ item: exam }) => (
                    <View key={exam.numOrder} style={styles.examItem}>

                        <Text style={styles.nameSubjectStyle}>{exam.name} - ({exam.id})</Text>
                        <View style={styles.info_style}>
                            <View>
                                <Text>Phòng thi: {exam.examRoom}</Text>
                                <Text>Ngày thi: {DateToString(exam.testDay)}</Text>
                            </View>
                            <View>
                                <Text>Tiết BĐ: {exam.lessonStart}</Text>
                                <Text>Số tiết: {exam.numOfLesson}</Text>
                            </View>
                        </View>
                        <Text style={{ marginTop: 12 }}>Hình thức thi: {exam.examForm}</Text>

                    </View>
                )}
            />
        );
    };


    /* Dropdown */
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const semesters = await getSemesters();
                console.log(semesters);
                const formattedListSemester = semesters.map(semester => ({
                    label: `${semester.name}`,
                    value: semester.id,
                }));
                // Find the current semester based on the start and end dates
                const now = moment();
                const currentSem = semesters.find(semester => {
                    return now.isBetween(moment(semester.startDate), moment(semester.endDate));
                });

                if (currentSem) {
                    setCurrentSemester(currentSem.id);
                    setSelectedIdSemester(currentSem.id);
                }
                setlistSemester(formattedListSemester);
                setIsLoading(true)
                const data = await getExams(currentSem.id);
                setExamData(data);
                setIsLoading(false)

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
    info_style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
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
        fontSize: 17,
    },
    dropdown: {
        marginTop: 5,
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ExamsSchedule;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { getExams, getSemesters } from '../service/NLUApiCaller';
import { loadPage } from '../BaseStyle/Style';

const ExamsSchedule = () => {
    const [listSemester, setlistSemester] = useState([]);
    const [examData, setExamData] = useState([]);
    const [selectedIdSemester, setSelectedIdSemester] = useState(20221);
    
    const [isLoading, setIsLoading] = useState(false);

//   const examData = [
//     { subject: "Toán", subjectCode: "MAT101", room: "A101", time: "8:00 AM", semester: "semester1" },
//     { subject: "Văn", subjectCode: "LAN201", room: "B202", time: "10:30 AM", semester: "semester1" },
//     // Thêm các mục khác nếu cần
//   ];
  useEffect(() => {
    const fetchExamsData = async () => {

      setIsLoading(true)
      const data = await getExams(selectedIdSemester);
      if (data.length > 0) {
        setExamData(data);

      } else {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra!',
          text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
      setIsLoading(false)

    };

    fetchExamsData();
  }, []);

  const displayExams = (semester) => {
    const data = getExams(semester);
    setExamData(data);
    // const data = getExams(semester);
    //   if (data.length > 0) {
    //     setExamData(data);

    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Có lỗi xảy ra!',
    //       text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
    //       visibilityTime: 2000,
    //       autoHide: true,
    //     });
    //   }
    return examData.map((exam) => (
      <View key={exam.numOrder} style={styles.examItem}>
        <Text>
          <Text style={styles.boldText}>{exam.name}</Text> ({exam.id}){'\n'}
          Phòng thi: {exam.examRoom}{'\n'}
          Tiết thi: {exam.lessonStart}
        </Text>
      </View>
    ));
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
            console.log(formattedListSemester.value)
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Có lỗi xảy ra!',
              text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
              visibilityTime: 2000,
              autoHide: true,
            });
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
            onChange={(item) => setSelectedIdSemester(item.value)}
          />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={reloadPage}
          >
            <Icon name="ios-refresh" size={24} color="black" />
          </TouchableOpacity>
          </View>
     

      <View style={styles.examList}>
        {displayExams(selectedIdSemester)}
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
  container_ses:{
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  examList: {
    marginTop: 15,
    width: '100%',
  },
  examItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  boldText: {
    fontWeight: 'bold',
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

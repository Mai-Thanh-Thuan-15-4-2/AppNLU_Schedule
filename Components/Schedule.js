import React, { useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, View, Text, Button, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars';
import moment from 'moment/min/moment-with-locales';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import { getSchedule, getSemesters } from '../service/NLUApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Schedule = () => {
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    [moment().format('YYYY-MM-DD')]: {
      selected: true,
      selectedColor: 'blue',
    },
  });
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [currentDay, setCurrentDay] = useState(moment().format('YYYY-MM-DD'));
  const [semesters, setSemesters] = useState([]);

 
  const addTask = async () => {
    const updatedTasks = { ...tasks };
    if (!updatedTasks[currentDay]) {
      updatedTasks[currentDay] = [];
    }
    let lastId = 0;
    lastId = updatedTasks[currentDay].length + 1;
    const newTaskWithId = { ...newTask, id: lastId.toString(), status: 0 };
    updatedTasks[currentDay].push(newTaskWithId);
    setTasks(updatedTasks);
  
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  
    setNewTask({});
    setIsTitleEmpty(true);
    setShowModal(false);
  };

  useEffect(() => {
    const retrieveTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('@tasks');
        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error retrieving tasks:', error);
      }
    };
  
    retrieveTasks();
  }, []);
  
  const deleteTask = async (id) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa công việc này không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: async () => {
            const updatedTasks = { ...tasks };
            const index = updatedTasks[currentDay].findIndex(task => task.id === id);
            if (index !== -1) {
              updatedTasks[currentDay].splice(index, 1);
              setTasks(updatedTasks);
              try {
                await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
              } catch (error) {
                console.error('Error saving tasks:', error);
              }
            }
          }
        }
      ]
    );
  };
  
  const editTask = async (task) => {
    const updatedTasks = { ...tasks };
    const taskIndex = updatedTasks[currentDay].findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      updatedTasks[currentDay][taskIndex] = task;
      setTasks(updatedTasks);
      setIsTitleEmpty(true);
      try {
        await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  };

  const generateMarkedDates = (tasks) => {
    const markedDates = {};
    const today = moment().format('YYYY-MM-DD');
  
    for (const date in tasks) {
      if (tasks.hasOwnProperty(date) && tasks[date].length > 0) {
        const isToday = date === today; 
        
  
        markedDates[date] = {
          customStyles: {
            container: {
              borderWidth: 1,
              borderColor: isToday ? 'aqua' : 'green',
              backgroundColor: 'white',
              borderRadius: 5,
            },
            text: {
              color: isToday ? 'aqua' : 'green', 
              fontWeight: 'bold',
            },
          },
        };
      }
    }
  
    return markedDates;
  };
  

  const handleTitleChange = (text) => {
    setNewTask(prev => ({ ...prev, title: text }));
    setIsTitleEmpty(!text);
  };
/* Dropdown */
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const semesters = await getSemesters();
        const formattedData = semesters.map(semester => ({
          label: `${semester.name}`,
          value: semester.id,
        }));
        setData(formattedData);
      // if (formattedData.length > 0) {
      //   setSelectedValue(formattedData[0].value);
      // }
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
  /* calendar */
  useEffect(() => {
    setIsTitleEmpty(newTask.title ? newTask.title.trim() === "" : true);
  }, [newTask.title]);
  
  useEffect(() => {
    const fetchTodaySchedule = async () => {
      const scheduleData = await getSchedule(selectedValue);
      if (scheduleData) {
        const tasksByDate = { ...tasks };
  
        scheduleData.forEach(subject => {
          const startDateString = moment(subject.startDate).format('20YY-MM-DD');
          const endDateString = moment(subject.endDate).format('20YY-MM-DD');
  
          const startDate = moment(subject.startDate);
          const endDate = moment(subject.endDate);
          const dayOfWeek = startDate.day();
          const currentWeek = startDate.week();
          const endWeek = endDate.week();
  
          for (let week = currentWeek; week <= endWeek; week++) {
            const markedDate = startDate.clone().week(week).day(dayOfWeek);
            const formattedDate = markedDate.format('20YY-MM-DD');
  
            if (!tasksByDate[formattedDate]) {
              tasksByDate[formattedDate] = [];
            }
  
            tasksByDate[formattedDate].push({
              id: subject.id,
              title: subject.name,
              time: `Tiết ${subject.lessonStart} - ${subject.lessonStart + subject.numOfLesson - 1}`,
              location: subject.classroom,
              instructor: `GV: ${subject.teacher}`,
              status: 1
            });
          }
        });
  
        setTasks(tasksByDate);
      } else {
        // setTasks({});
      }
    };
  
    fetchTodaySchedule();
  }, [selectedValue]);
  useEffect(() => {
    const fetchSemesters = async () => {
      const semestersData = await getSemesters();
      if (semestersData) {
        setSemesters(semestersData);
      }
    };
  
    fetchSemesters();
  }, []);
  
  useEffect(() => {
    const selectedSemester = semesters.find(semester => semester.id === selectedValue);
    if (selectedSemester && selectedSemester.startDate) {
      const formattedStartDate = moment(selectedSemester.startDate).format('20YY-MM-DD');
      setSelectedDate({
        [formattedStartDate]: {
          selected: true,
          selectedColor: 'blue',
        },
      });
      setCurrentDay(formattedStartDate);
    }
  }, [selectedValue, semesters]);
  const uniqueTasks = (tasks) => {
    const seen = new Set();
    return tasks.filter(task => {
      const key = `${task.id}-${task.time}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };
  const markedDates = generateMarkedDates(tasks);
  const totalTasksForCurrentDay = uniqueTasks(tasks[currentDay] ?? []).length;
  
  const reloadPage = async () => {
    try {
      const today = moment().format('YYYY-MM-DD');
      setSelectedDate({
        [today]: {
          selected: true,
          selectedColor: 'blue',
        },
      });
      setCurrentDay(today);
      const semestersData = await getSemesters();
      if (semestersData) {
        const formattedData = semestersData.map(semester => ({
          label: `${semester.name}`,
          value: semester.id,
        }));
        setData(formattedData);
        if (formattedData.length > 0) {
          setSelectedValue(formattedData[0].value);
        }
      }
  
      const scheduleData = await getSchedule(selectedValue);
      if (scheduleData) {
        const tasksByDate = {};
        scheduleData.forEach(subject => {
          const startDateString = moment(subject.startDate).format('20YY-MM-DD');
          const endDateString = moment(subject.endDate).format('20YY-MM-DD');
        
          const startDate = moment(subject.startDate);
          const endDate = moment(subject.endDate);
          const dayOfWeek = startDate.day();
          const currentWeek = startDate.week();
          const endWeek = endDate.week();
        
          for (let week = currentWeek; week <= endWeek; week++) {
            const markedDate = startDate.clone().week(week).day(dayOfWeek);
            const formattedDate = markedDate.format('YYYY-MM-DD');
        
            if (!tasksByDate[formattedDate]) {
              tasksByDate[formattedDate] = [];
            }
        
            tasksByDate[formattedDate].push({
              id: subject.id,
              title: subject.name,
              time: `Tiết ${subject.lessonStart} - ${subject.lessonStart + subject.numOfLesson - 1}`,
              location: subject.classroom,
              instructor: `GV: ${subject.teacher}`,
              status: 1
            });
          }
        });
        setTasks(tasksByDate);
      } else {
        setTasks({});
      }
    } catch (error) {
      console.error('Error reloading page:', error);
    }
  };
 
  
  const onDayPress = async (day) => {
    setSelectedDate({
      [day.dateString]: {
        selected: true,
        selectedColor: 'blue',
      },
    });
    setCurrentDay(day.dateString);
  
    try {
      const scheduleData = await getSchedule(selectedValue);
      const tasksByDate = { ...tasks }; 
  
      if (scheduleData) {
        scheduleData.forEach(subject => {
          const startDateString = moment(subject.startDate).format('20YY-MM-DD');
          const endDateString = moment(subject.endDate).format('20YY-MM-DD');
  
          const startDate = moment(subject.startDate);
          const endDate = moment(subject.endDate);
          const dayOfWeek = startDate.day();
          const currentWeek = startDate.week();
          const endWeek = endDate.week();
  
          for (let week = currentWeek; week <= endWeek; week++) {
            const markedDate = startDate.clone().week(week).day(dayOfWeek);
            const formattedDate = markedDate.format('YYYY-MM-DD');
  
            if (!tasksByDate[formattedDate]) {
              tasksByDate[formattedDate] = [];
            }
  
            tasksByDate[formattedDate].push({
              id: subject.id,
              title: subject.name,
              time: `Tiết ${subject.lessonStart} - ${subject.lessonStart + subject.numOfLesson - 1}`,
              location: subject.classroom,
              instructor: `GV: ${subject.teacher}`,
              status: 1
            });
          }
        });
      }
  
      setTasks(tasksByDate);
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
  
  return (
    <View style={{
      paddingHorizontal: 10,
    }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  <Dropdown
    style={{
      width: '90%',
      height: 40,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    data={data}
    labelField="label"
    valueField="value"
    placeholder="Chọn học kỳ"
    value={selectedValue}
    onChange={(item) => setSelectedValue(item.value)}
  />
  <TouchableOpacity
    style={{
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={reloadPage}
  >
    <Icon name="ios-refresh" size={24} color="black" />
  </TouchableOpacity>
</View>

      <Calendar
        key={currentDay}
        style={{
          backgroundColor: 'white',
          marginTop: 10,
          borderRadius: 10,
        }}

        markingType='custom'
        markedDates={{ ...markedDates, ...selectedDate}}
        current={currentDay}
        onDayPress={onDayPress}
        hideExtraDays
        theme={{
          'stylesheet.calendar.main': {
            dayToday: {
              borderWidth: 2,
            },
          },
          'stylesheet.day.basic': {
            sunday: {
              color: 'red',
              fontWeight: 'bold',
            },
          },
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, alignItems: 'center' }}>
        <Text style={{ marginRight: 5, marginTop: 5 }}>Tổng số: <Text style={{ color: 'blue', fontWeight: 'bold' }}>{totalTasksForCurrentDay}</Text></Text>
        <View style={{ marginTop: 5, width: 200, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'green', marginRight: 5 }} />
          <Text>Ngày học</Text>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', marginRight: 5, marginLeft: 10 }} />
          <Text>Ngày thi</Text>
        </View>
        <TouchableOpacity style={{ width: 30, borderRadius: 5, marginTop: 5, backgroundColor: 'black', alignItems: 'center', marginLeft: 10 }} onPress={() => setShowModal(true)}>
          <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'green', alignItems: 'center', justifyContent: 'center' }}>THÊM LỊCH HỌC</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>Tên môn học:{isTitleEmpty && <Text style={{ color: 'red' }}>*</Text>}</Text>
              <TextInput style={{ marginLeft: 10, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={handleTitleChange} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Thời gian:</Text>
              <TextInput style={{ marginLeft: 34, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, time: text }))} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Phòng học:</Text>
              <TextInput style={{ marginLeft: 25, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, location: text }))} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Giảng viên:</Text>
              <TextInput style={{ marginLeft: 26, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, instructor: text }))} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginTop: 10 }}>
                <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, backgroundColor: '#003', alignItems: 'center', justifyContent: 'center' }} onPress={() => setShowModal(false)}>
                  <Text style={{ color: 'white' }}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, backgroundColor: isTitleEmpty ? 'lightgray' : 'blue', alignItems: 'center', justifyContent: 'center' }} onPress={addTask} disabled={isTitleEmpty}>
                  <Text style={{ color: 'white' }}>Thêm</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={uniqueTasks(tasks[currentDay] ?? [])}
        keyExtractor={item => `${item.id}-${item.time}`}
        style={{ height: 66 * 3 + 50 }}
        renderItem={({ item }) => (
          <View style={{
            marginTop: 10,
            width: '100%',
            height: 66,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            paddingHorizontal: 10
          }}>

            <View style={{ flexDirection: 'row' }}>
              <Text>
                <Icon name="book-outline" size={15} color="#000" />:{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {item.title && item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}
                </Text>
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                <TouchableOpacity onPress={() => { setNewTask(item); setModal2Visible(true); }} disabled={item.status === 1}>
                  <Icon name="create-outline" size={20} color={item.status === 1 ? 'gray' : 'blue'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)} style={{ marginLeft: 10 }} disabled={item.status === 1}>
                  <Icon name="trash" size={20} color={item.status === 1 ? 'gray' : 'red'} />
                </TouchableOpacity>
              </View>
            </View>
            <Text><Icon name="alarm-outline" size={15} color="#000" />: <Text style={{ color: 'red' }}>{item.time && item.time.length > 20 ? item.time.substring(0, 20) + '...' : item.time}, {item.location && item.location.length > 15 ? item.location.substring(0, 15) + '...' : item.location}</Text></Text>
            <Text><Icon name="person-outline" size={15} color="#000" />: <Text>{item.instructor && item.instructor.length > 35 ? item.instructor.substring(0, 35) + '...' : item.instructor}</Text></Text>
          </View>
        )}
      />

      <Modal visible={isModal2Visible} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'green', alignItems: 'center', justifyContent: 'center' }}>SỬA LỊCH HỌC</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>Tên môn học: {isTitleEmpty && <Text style={{ color: 'red' }}>*</Text>}</Text>
              <TextInput style={{ marginLeft: 10, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, title: text }))}
                value={newTask.title} maxLength={30} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Thời gian:</Text>
              <TextInput style={{ marginLeft: 34, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, time: text }))}
                value={newTask.time} maxLength={20} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Phòng học:</Text>
              <TextInput style={{ marginLeft: 25, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, location: text }))}
                value={newTask.location} maxLength={15} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Giảng viên:</Text>
              <TextInput style={{ marginLeft: 26, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, instructor: text }))}
                value={newTask.instructor} maxLength={30} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginTop: 10 }}>
                <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: '#003', alignItems: 'center', justifyContent: 'center' }} onPress={() => setModal2Visible(false)}>
                  <Text style={{ color: 'white' }}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: isTitleEmpty ? 'lightgray' : 'blue', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                  if (!isTitleEmpty) {
                    editTask(newTask);
                    setModal2Visible(false);
                  }
                }}>
                  <Text style={{ color: 'white' }}>Cập nhật</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
};


export default Schedule;

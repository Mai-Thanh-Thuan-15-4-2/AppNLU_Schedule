import React, { useEffect, useState, useRef } from 'react';
import {SafeAreaView, Keyboard, PanResponder, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, Dimensions, FlatList, View, Text, TextInput, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars';
import moment from 'moment/min/moment-with-locales';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, loadPage } from '../BaseStyle/Style';
import { Alert } from 'react-native';
import { getSchedule, getSemesters } from '../service/NLUApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Schedule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [lastTaskId, setLastTaskId] = useState(0);
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const [isTitleUpdateEmpty, setIsTitleUpdateEmpty] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [currentDay, setCurrentDay] = useState(moment().format('20YY-MM-DD'));
  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    [moment().format('20YY-MM-DD')]: {
      selected: true,
      selectedColor: '#0D1282',
    },
  });


  const handleIncrease = () => {
    setNumberOfWeeks(prevNumber => prevNumber + 1);
  };

  const handleDecrease = () => {
    setNumberOfWeeks(prevNumber => (prevNumber > 1 ? prevNumber - 1 : 1));
  };

  const handleTextChange = (text) => {
    const parsedNumber = parseInt(text);
    if (!isNaN(parsedNumber)) {
      setNumberOfWeeks(parsedNumber);
    }
  };

  const addTask = async () => {
    const startDate = moment(currentDay);
    const endDate = startDate.clone().add(numberOfWeeks * 7, 'days');
    let updatedTasks = { ...tasks };
    let dayOfWeek = startDate.day();

    for (let date = startDate; date.isBefore(endDate); date.add(1, 'weeks')) {
      const taskDate = date.clone().day(dayOfWeek);
      const formattedDate = taskDate.format('20YY-MM-DD');

      if (!updatedTasks[formattedDate]) {
        updatedTasks[formattedDate] = [];
      }
      const newTaskWithId = {
        ...newTask,
        id: (lastTaskId + 1).toString,
        status: 0,
        startDate: taskDate.format('20YY-MM-DD'),
        endDate: endDate.format('20YY-MM-DD')
      };
      updatedTasks[formattedDate].push(newTaskWithId);
    }

    setTasks(updatedTasks);

    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
    setLastTaskId(lastTaskId + 1);
    setNewTask({});
    setIsTitleEmpty(true);
    setNumberOfWeeks(1);
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
    setIsTitleEmpty(true);
  }, []);

  const deleteTask = async (id) => {
    const taskToDelete = tasks[currentDay].find(task => task.id === id);
    const endDate = taskToDelete ? moment(taskToDelete.endDate) : null;

    if (!endDate) {
      console.error('Task with the specified ID does not have an endDate or does not exist.');
      return;
    }

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

            Object.keys(updatedTasks).forEach(date => {
              const index = updatedTasks[date].findIndex(task => task.id === id && task.endDate === taskToDelete.endDate);
              if (index !== -1) {
                updatedTasks[date].splice(index, 1);
              }
            });

            setTasks(updatedTasks);
            try {
              await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
            } catch (error) {
              console.error('Error saving tasks:', error);
            }
          }
        }
      ]
    );
  };
  // xử lý sự kiện nút back
  const handleBackButton = () => {
    setIsTitleEmpty(true);
    setShowModal(false);
  };
  const handleBackUpdateButton = () => {
    setIsTitleUpdateEmpty(false);
    setModal2Visible(false);
  };
  const openEditModal = (taskToEdit) => {
    const start = moment(taskToEdit.startDate);
    const end = moment(taskToEdit.endDate);
    const duration = moment.duration(end.diff(start));
    const weeks = duration.asWeeks();

    setNewTask({ ...taskToEdit, numberOfWeeks: Math.round(weeks) });
    setIsTitleUpdateEmpty(!taskToEdit.title.trim());
    setModal2Visible(true);
  };

  const editTask = async (task) => {
    const updatedTasks = { ...tasks };
    const start = moment(task.startDate);
    const oldEndDate = moment(task.endDate);
    const newEndDate = start.clone().add(task.numberOfWeeks * 7, 'days');
    const dayOfWeek = start.day();

    if (newEndDate.isBefore(oldEndDate)) {
      Object.keys(updatedTasks).forEach(date => {
        if (moment(date).isAfter(newEndDate)) {
          updatedTasks[date] = updatedTasks[date].filter(t => !(t.id === task.id && t.dayOfWeek === dayOfWeek));
        }
      });
    }
    if (newEndDate.isAfter(oldEndDate)) {
      let date = oldEndDate.clone().add(1, 'weeks').day(dayOfWeek);
      while (date.isSameOrBefore(newEndDate)) {
        const formattedDate = date.format('20YY-MM-DD');
        if (!updatedTasks[formattedDate]) {
          updatedTasks[formattedDate] = [];
        }
        updatedTasks[formattedDate].push({ ...task, startDate: formattedDate, endDate: newEndDate.format('20YY-MM-DD') });
        date.add(1, 'weeks');
      }
    }
    const taskIndex = updatedTasks[task.startDate].findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      updatedTasks[task.startDate][taskIndex] = { ...task, endDate: newEndDate.format('20YY-MM-DD') };
    }
    setIsTitleUpdateEmpty(false);
    setNumberOfWeeks(1);
    setTasks(updatedTasks);
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };


  const generateMarkedDates = (tasks) => {
    const markedDates = {};
    const today = moment().format('YYYY-MM-DD');
    markedDates[today] = {
      customStyles: {
        container: {
          borderWidth: 1,
          borderColor: 'aqua',
          backgroundColor: 'white',
          borderRadius: 0
        },
        text: {
          color: 'aqua',
          fontWeight: 'bold',
        },
      },
    };
    for (const date in tasks) {
      if (tasks.hasOwnProperty(date) && tasks[date].length > 0) {
        const isToday = date === today;

        // Lọc những task duy nhất trong mỗi ngày dựa trên ID
        const uniqueTasks = tasks[date].reduce((unique, task) => {
          if (!unique.find(item => item.id === task.id && item.time === task.time)) {
            unique.push(task);
          }
          return unique;
        }, []);

        const numberOfTasks = uniqueTasks.length;

        let borderColor = 'green';
        // if (numberOfTasks === 1) {
        //   borderColor = '#026E21';
        // } else if (numberOfTasks === 2) {
        //   borderColor = '#D6C400';
        // } else if (numberOfTasks == 3) {
        //   borderColor = '#ED8505';
        // } else if (numberOfTasks >= 4) {
        //   borderColor = '#ED0528';
        // }

        markedDates[date] = {
          customStyles: {
            container: {
              borderWidth: 1,
              borderColor: isToday ? 'green' : borderColor,
              backgroundColor: 'white',
              borderRadius: 5,
            },
            text: {
              color: isToday ? 'aqua' : borderColor,
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

        // Find the current semester based on the start and end dates
        const now = moment();
        const currentSem = semesters.find(semester => {
          return now.isBetween(moment(semester.startDate), moment(semester.endDate));
        });

        if (currentSem) {
          setCurrentSemester(currentSem.id);
          setSelectedValue(currentSem.id);
        }

        setData(formattedData);
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
// Xem lịch theo học kỳ
useEffect(() => {
  setIsLoading(true);
  const selectedSemester = semesters.find(semester => semester.id === selectedValue);
  if (selectedSemester && selectedSemester.startDate && selectedSemester.endDate) {
    const now = moment();
    const startDate = moment(selectedSemester.startDate);
    const endDate = moment(selectedSemester.endDate);

    // Check if the current date is within the selected semester
    if (now.isBetween(startDate, endDate, undefined, '[]')) {
      setCurrentDay(now.format('20YY-MM-DD'));
      setSelectedDate({
        [now.format('YYYY-MM-DD')]: {
          selected: true,
          selectedColor: '#0D1282',
        },
      });
    } else {
      const formattedStartDate = startDate.format('20YY-MM-DD');
      setSelectedDate({
        [formattedStartDate]: {
          selected: true,
          selectedColor: '#0D1282',
        },
      });
      setCurrentDay(formattedStartDate);
    }
    setIsLoading(false);
  }
}, [selectedValue, semesters, isLoading]);

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
      setIsLoading(true);
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
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra!',
        text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setIsLoading(false)
    }
  };

  const handleTitleUpdateChange = (text) => {
    setNewTask(prev => ({ ...prev, title: text }));
    setIsTitleUpdateEmpty(!text.trim());
  };


  const onDayPress = async (day) => {
    setSelectedDate({
      [day.dateString]: {
        selected: true,
        selectedColor: '#0D1282',
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
          if (currentWeek > endWeek) {
            let temp = startDate;
            while (temp.isSameOrBefore(endDate)) {

              const formattedDate = temp.format('20YY-MM-DD');
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
              temp = temp.add(7, 'days');

            }
          } else
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
  const windowHeight = Dimensions.get('window').height;
  const bottomTabHeight = 60;
  const flatListHeight = windowHeight * 0.4 - bottomTabHeight;

  const [swipeCount, setSwipeCount] = useState(0);

  const handleSwipeRight = () => {
    setSwipeCount(prevCount => prevCount - 1);
  };

  const handleSwipeLeft = () => {
    setSwipeCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    const updatedDate = moment().add(swipeCount, 'months').format('YYYY-MM-DD');
    setCurrentDay(updatedDate);
  }, [swipeCount]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 50) {
          handleSwipeRight();
        } else if (gestureState.dx < -50) {
          handleSwipeLeft();
        }
      },
    })
  ).current;
  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View style={loadPage.loadingContainer}>
          <ActivityIndicator size="large" color="#2bc250" />
        </View>
      )}
      <View style={{
        paddingHorizontal: 10,
      }}>
        <View style={styles.container}>
          <Dropdown
            style={styles.dropdown}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Chọn học kỳ"
            value={selectedValue}
            defaultValue={currentSemester}
            onChange={(item) => {
              setSelectedValue(item.value);
              setIsLoading(true);
              if (item.value === currentSemester) {
                setCurrentDay(moment().format('20YY-MM-DD'));
              }
            }}
          />

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={reloadPage}
          >
            <Icon name="ios-refresh" size={30} style={{ marginTop: 5 }} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonAddTask} onPress={() => setShowModal(true)}>
            <Text style={styles.addTask}>+</Text>
          </TouchableOpacity>
        </View>
        <View {...panResponder.panHandlers}>
          <Calendar
            key={currentDay}
            style={styles.calendar}
            markingType='custom'
            markedDates={{ ...markedDates, ...selectedDate }}
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
        </View>
        {/* <View style={styles.innerContainer}>
          <Text style={styles.marginRT_5 + styles.font_30}>Tổng số: <Text style={styles.textblue_bold}>{totalTasksForCurrentDay}</Text></Text>
        </View> */}
        <Modal visible={showModal} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingContainer}>
              <View style={styles.containerModal}>
                <View style={styles.modalContent}>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: 'green', alignItems: 'center', justifyContent: 'center' }}>THÊM LỊCH HỌC</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    {/* {isTitleEmpty && <Text style={{ color: 'red' }}>*</Text>} */}
                    <Text style={{ fontWeight: 'bold' }}>Tên môn học:</Text>
                    <TextInput style={{ marginLeft: 10, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={handleTitleChange} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Thời gian:</Text>
                    <TextInput style={{ marginLeft: 34, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={text => setNewTask(prev => ({ ...prev, time: text }))} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Phòng học:</Text>
                    <TextInput style={{ marginLeft: 25, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={text => setNewTask(prev => ({ ...prev, location: text }))} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Giảng viên:</Text>
                    <TextInput style={{ marginLeft: 26, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={text => setNewTask(prev => ({ ...prev, instructor: text }))} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Chọn số tuần:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 50 }}>
                      <TouchableOpacity onPress={handleDecrease}>
                        <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>-</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={{ height: 30, width: 100, borderRadius: 5, textAlign: 'center', borderWidth: 1, borderColor: 'gray' }}
                        onChangeText={handleTextChange}
                        value={numberOfWeeks.toString()}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity onPress={handleIncrease}>
                        <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginTop: 10 }}>
                      <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, backgroundColor: '#003', alignItems: 'center', justifyContent: 'center' }} onPress={handleBackButton}>
                        <Text style={{ color: 'white' }}>Quay lại</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, backgroundColor: isTitleEmpty ? 'lightgray' : '#0D1282', alignItems: 'center', justifyContent: 'center' }} onPress={addTask} disabled={isTitleEmpty}>
                        <Text style={{ color: 'white' }}>Thêm</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
          {totalTasksForCurrentDay === 0 ? (
            <View style={styles.centeredText}>
              <Text style={{ fontWeight: 'bold', color: "green" }}>Hôm nay không có môn học nào 😊😉</Text>
            </View>
          ) : (
            <FlatList
            style={[{ marginTop: 5, marginBottom: 380, marginLeft: 5}]}
              data={uniqueTasks(tasks[currentDay] ?? [])}
              keyExtractor={item => `${item.id}-${item.time}`}
              renderItem={({ item }) => (
                <SafeAreaView style={{ flex: 1}}>
                <View style={styles.containerFlatList}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text>
                      <Icon name="book-outline" size={15} color="#000" />:{' '}
                      <Text style={{ fontWeight: 'bold' }}>
                        {item.title && item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}
                      </Text>
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                      <TouchableOpacity onPress={() => openEditModal(item)} disabled={item.status === 1}>
                        <Icon name="create-outline" size={20} color={item.status === 1 ? 'gray' : '#0D1282'} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteTask(item.id)} style={{ marginLeft: 10 }} disabled={item.status === 1}>
                        <Icon name="trash" size={20} color={item.status === 1 ? 'gray' : 'red'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text><Icon name="alarm-outline" size={15} color="#000" />: <Text style={{ color: 'red' }}>{item.time && item.time.length > 20 ? item.time.substring(0, 20) + '...' : item.time}, {item.location && item.location.length > 15 ? item.location.substring(0, 15) + '...' : item.location}</Text></Text>
                  <Text><Icon name="person-outline" size={15} color="#000" />: <Text>{item.instructor && item.instructor.length > 35 ? item.instructor.substring(0, 35) + '...' : item.instructor}</Text></Text>
                </View>
                </SafeAreaView>
              )}
            />
          )}
        <Modal visible={isModal2Visible} transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingContainer}>
              <View style={styles.containerModal}>
                <View style={styles.modalContent}>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: 'green', alignItems: 'center', justifyContent: 'center' }}>SỬA LỊCH HỌC</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    {/* {isTitleUpdateEmpty && <Text style={{ color: 'red' }}>*</Text>} */}
                    <Text style={{ fontWeight: 'bold' }}>Tên môn học: </Text>
                    <TextInput style={{ marginLeft: 10, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={handleTitleUpdateChange}
                      value={newTask.title} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Thời gian:</Text>
                    <TextInput style={{ marginLeft: 34, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={text => setNewTask(prev => ({ ...prev, time: text }))}
                      value={newTask.time} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Phòng học:</Text>
                    <TextInput style={{ marginLeft: 25, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={text => setNewTask(prev => ({ ...prev, location: text }))}
                      value={newTask.location} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Giảng viên:</Text>
                    <TextInput style={{ marginLeft: 26, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 10 }} onChangeText={text => setNewTask(prev => ({ ...prev, instructor: text }))}
                      value={newTask.instructor} />
                  </View>
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Chọn số tuần:</Text>
                <TouchableOpacity onPress={handleDecrease1}>
                  <Text style={{ fontSize: 20, paddingHorizontal: 10,  marginLeft: 50 }}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={{ height: 30, width: 100, borderRadius: 5, textAlign: 'center', borderWidth: 1, borderColor: 'gray' }}
                  onChangeText={text => {
                    const parsedNumber = parseInt(text);
                    if (!isNaN(parsedNumber)) {
                      setNewTask(prev => ({ ...prev, numberOfWeeks: parsedNumber }));
                    }
                  }}
                  value={newTask.numberOfWeeks?.toString()}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={handleIncrease1}>
                  <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>+</Text>
                </TouchableOpacity>
              </View> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginTop: 10 }}>
                      <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: '#003', alignItems: 'center', justifyContent: 'center' }} onPress={handleBackUpdateButton}>
                        <Text style={{ color: 'white' }}>Quay lại</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: isTitleUpdateEmpty ? 'lightgray' : '#0D1282', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                          if (!isTitleUpdateEmpty) {
                            editTask(newTask);
                            setModal2Visible(false);
                          }
                        }}
                        disabled={isTitleUpdateEmpty}>
                        <Text style={{ color: 'white' }}>Cập nhật</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  ActivityIndicator: {
    position: 'absolute', zIndex: 9999, width: 50, height: 50
  },
  innerContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, alignItems: 'center'
  },
  font_30: {
    fontSize: 30,
  },
  addTask: {
    color: 'black', fontSize: 20
  },
  buttonAddTask: {
    width: 32, borderRadius: 5, marginTop: 5, borderWidth: 2, alignItems: 'center'
  },
  textblue_bold: {
    color: 'blue',
    fontWeight: 'bold'
  },
  marginRT_5: {
    marginRight: 5,
    marginTop: 5,
  },
  modalContent: {
    backgroundColor: 'white', padding: 20, borderRadius: 10
  },
  dropdown: {
    marginLeft: 5,
    marginTop: 5,
    width: '75%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 50,
    height: 50,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskBtn: {

  },
  containerFlatList: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10
  },
  flatListContent: {

  },
  calendar: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  containerModal: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'
  },
  modalAdd: {

  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredText: {
    marginTop: 100, marginBottom: 200, marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Schedule;

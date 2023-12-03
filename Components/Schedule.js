import React, { useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, View, Text, Button, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars';
import moment from 'moment/min/moment-with-locales';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import Swiper from 'react-native-swiper';

const allTasks = {
  '2023-11-27': [
    {
      id: '1',
      title: 'An toàn và bảo mật hệ thống thông tin',
      time: 'Tiết 4 -7(09:30)',
      location: 'P3',
      instructor: 'GV: P.D.Long',
      status: 1
    },
    {
      id: '2',
      title: 'Data Mining',
      time: 'Tiết 7 -10(12:15)',
      location: 'P5',
      instructor: 'GV: T.Q.Việt',
      status: 1
    },
  ],
  '2023-11-28': [
    {
      id: '1',
      title: 'An toàn và bảo mật hệ thống thông tin',
      time: 'Tiết 4 -7(09:30)',
      location: 'P3',
      instructor: 'GV: P.D.Long',
      status: 1
    },
    {
      id: '2',
      title: 'Data Mining',
      time: 'Tiết 7 -10(12:15)',
      location: 'P5',
      instructor: 'GV: T.Q.Việt',
      status: 1
    },
    {
      id: '3',
      title: 'Data Mining',
      time: 'Tiết 7 -10(12:15)',
      location: 'P5',
      instructor: 'GV: T.Q.Việt',
      status: 1
    },
    {
      id: '4',
      title: 'Data Mining',
      time: 'Tiết 7 -10(12:15)',
      location: 'P5',
      instructor: 'GV: T.Q.Việt',
      status: 1
    },
  ],
};
const data = [
  { label: 'Học kỳ 1 Năm học 2023-2024', value: '1' },
  { label: 'Học kỳ 2 Năm học 2023-2024', value: '2' },
];

const Schedule = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    [moment().format('YYYY-MM-DD')]: {
      selected: true,
      selectedColor: 'blue',
    },
  });
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM-DD'));
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const handleSwipeLeft = () => {
    const nextMonth = moment(currentMonth).add(1, 'months').format('YYYY-MM-DD');
    setCurrentMonth(nextMonth);
  };

  const handleSwipeRight = () => {
    const prevMonth = moment(currentMonth).subtract(1, 'months').format('YYYY-MM-DD');
    setCurrentMonth(prevMonth);
  };
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [currentDay, setCurrentDay] = useState('');

  const onDayPress = (day) => {
    setSelectedDate({
      [day.dateString]: {
        selected: true,
        selectedColor: 'blue',
      },
    });
    setCurrentDay(day.dateString);
    setTasks(allTasks[day.dateString] || []);
  };
  let lastId = 0;

  const addTask = () => {
    if (!allTasks[currentDay]) {
      allTasks[currentDay] = [];
    }
    lastId = allTasks[currentDay].length + 1;
    const newTaskWithId = { ...newTask, id: lastId.toString(), status: 0 };
    allTasks[currentDay].push(newTaskWithId);
    setTasks(allTasks[currentDay]);
    setNewTask({});
    setIsTitleEmpty(true);
    setShowModal(false);
  };

  const deleteTask = (id) => {
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
          onPress: () => {
            const index = allTasks[currentDay].findIndex(task => task.id === id);
            if (index !== -1) {
              allTasks[currentDay].splice(index, 1);
            }
            setTasks([...allTasks[currentDay]]);
          }
        }
      ]
    );
  };
  const editTask = (task) => {
    const taskIndex = allTasks[currentDay].findIndex(t => t.id === task.id);

    if (taskIndex !== -1) {
      allTasks[currentDay][taskIndex] = task;
    }
    setTasks([...allTasks[currentDay]]);
  };

  const generateMarkedDates = () => {
    const markedDates = {};

    for (const date in allTasks) {
      markedDates[date] = {
        customStyles: {
          container: {
            borderWidth: 1,
            borderColor: 'green',
            backgroundColor: 'white',
            borderRadius: 5,
          },
          text: {
            color: 'green',
            fontWeight: 'bold',
          },
        },
      };
    }

    return markedDates;
  };

  const handleTitleChange = (text) => {
    setNewTask(prev => ({ ...prev, title: text }));
    setIsTitleEmpty(!text);
  };
  useEffect(() => {
    setIsTitleEmpty(newTask.title ? newTask.title.trim() === "" : true);
  }, [newTask.title]);
  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    setCurrentDay(today);
    setTasks(allTasks[today] || []);
  }, []);

  const markedDates = generateMarkedDates();

  return (
    <View style={{
      paddingHorizontal: 10,
    }}>
      <Dropdown
        style={{
          width: '100%',
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

      <Calendar
        style={{
          backgroundColor: 'white',
          marginTop: 10,
          borderRadius: 10,
        }}
        markingType='custom'
        markedDates={{ ...markedDates, ...selectedDate }}
        current={moment().format('YYYY-MM-DD')}
        onDayPress={onDayPress}
        onSwipeNext={handleSwipeLeft}
        onSwipePrev={handleSwipeRight}
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
        <Text style={{ marginRight: 5, marginTop: 5 }}>Tổng số: <Text style={{ color: 'blue', fontWeight: 'bold' }}>{tasks.length}</Text></Text>
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
        data={tasks}
        keyExtractor={item => item.id.toString()}
        style={{ height: 66 * 3 + 50, }}
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

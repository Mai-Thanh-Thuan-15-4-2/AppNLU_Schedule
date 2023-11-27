import React, { useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, View, Text, Button, TextInput, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars';
import moment from 'moment/min/moment-with-locales';
import Icon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';

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
  const addTask = () => {
    if (!allTasks[currentDay]) {
      allTasks[currentDay] = [];
    }
    const newId = allTasks[currentDay].length + 1;
    const newTaskWithId = { ...newTask, id: newId.toString(), status: 0 };
    allTasks[currentDay].push(newTaskWithId);
    setTasks(allTasks[currentDay]);
    setNewTask({});
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
        dots: Array(allTasks[date].length).fill({ color: 'green' }),
      };
    }

    return markedDates;
  };

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
        search
        searchPlaceholder="Tìm kiếm học kỳ"
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
          borderRadius: 10
        }}
        markingType='multi-dot'
        markedDates={{ ...markedDates, ...selectedDate }}
        current={moment().format('YYYY-MM-DD')}
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
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10, alignItems: 'center' }}>
        <View style={{ marginTop: 5, borderWidth: 2, width: 200, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: 'gray' }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'green', marginRight: 5 }} />
          <Text>Ngày học</Text>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', marginRight: 5, marginLeft: 10 }} />
          <Text>Ngày thi</Text>
        </View>
        <TouchableOpacity style={{ width: 20, borderRadius: 5, marginTop: 5, backgroundColor: 'black', alignItems: 'center', marginLeft: 10 }} onPress={() => setShowModal(true)}>
          <Text style={{ color: 'white' }}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'green', alignItems: 'center', justifyContent: 'center' }}>THÊM LỊCH HỌC</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>Tên môn học:</Text>
              <TextInput style={{ marginLeft: 10, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, title: text }))} maxLength={30}/>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Thời gian:</Text>
              <TextInput style={{ marginLeft: 34, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, time: text }))} maxLength={20} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Phòng học:</Text>
              <TextInput style={{ marginLeft: 25, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, location: text }))} maxLength={15}/>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Giảng viên:</Text>
              <TextInput style={{ marginLeft: 26, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, instructor: text }))} maxLength={30}/>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <TouchableOpacity style={{ marginLeft: 100, width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: '#003', alignItems: 'center', justifyContent: 'center' }} onPress={() => setShowModal(false)}>
                <Text style={{ color: 'white' }}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 90, width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }} onPress={addTask}>
                <Text style={{ color: 'white' }}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList 
  data={tasks}
  keyExtractor={item => item.id.toString()}
  style={{height: 270}}
  renderItem={({ item }) => (
    <View style={{ 
      marginTop: 10,
      width: '100%', 
      height: 66, 
      borderWidth: 1, 
      borderColor: 'black', 
      borderRadius: 10, 
      paddingHorizontal: 10}}>
      
      <View style={{ flexDirection: 'row' }}>
        <Text><Icon name="book-outline" size={15} color="#000" />: <Text style={{ fontWeight: 'bold' }}>{item.title}</Text></Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
          <TouchableOpacity onPress={() => { setNewTask(item); setModal2Visible(true); }} disabled={item.status === 1}>
            <Icon name="create-outline" size={20} color={item.status === 1 ? 'gray' : 'blue'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(item.id)} style={{ marginLeft: 10 }} disabled={item.status === 1}>
            <Icon name="trash" size={20} color={item.status === 1 ? 'gray' : 'red'} />
          </TouchableOpacity>
        </View>
      </View>
      <Text><Icon name="alarm-outline" size={15} color="#000" />: <Text style={{ color: 'red' }}>{item.time}, {item.location}</Text></Text>
      <Text><Icon name="person-outline" size={15} color="#000" />: <Text>{item.instructor}</Text></Text>
    </View>
  )}
/>
<Modal visible={isModal2Visible} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <View style={{ marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', color: 'green', alignItems: 'center', justifyContent: 'center' }}>SỬA LỊCH HỌC</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>Tên môn học:</Text>
              <TextInput style={{ marginLeft: 10, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }}   onChangeText={text => setNewTask(prev => ({ ...prev, title: text }))}
  value={newTask.title} maxLength={30}/>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Thời gian:</Text>
              <TextInput style={{ marginLeft: 34, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, time: text }))}
  value={newTask.time} maxLength={20} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Phòng học:</Text>
              <TextInput style={{ marginLeft: 25, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, location: text }))}
  value={newTask.location} maxLength={15}/>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Giảng viên:</Text>
              <TextInput style={{ marginLeft: 26, height: 30, width: '72%', borderColor: 'gray', borderWidth: 1, borderRadius: 5 }} onChangeText={text => setNewTask(prev => ({ ...prev, instructor : text }))}
  value={newTask.instructor} maxLength={30}/>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <TouchableOpacity style={{ marginLeft: 100, width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: '#003', alignItems: 'center', justifyContent: 'center' }} onPress={() => setModal2Visible(false)}>
                <Text style={{ color: 'white' }}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 90, width: 80, borderRadius: 5, height: 30, marginTop: 5, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
    editTask(newTask);
    setModal2Visible(false);
  }}>
                <Text style={{ color: 'white' }}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
};

export default Schedule;

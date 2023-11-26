import React, { useEffect } from 'react';
import { ScrollView, FlatList, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar } from 'react-native-calendars'; 
import moment from 'moment/min/moment-with-locales';
import Icon from 'react-native-vector-icons/Ionicons';

const tasks = [
  { 
    id: '1', 
    title: 'An toàn và bảo mật hệ thống thông tin', 
    time: 'Tiết 4 -7(09:30)', 
    location: 'P3', 
    instructor: 'GV: P.D.Long' 
  },
  { 
    id: '2', 
    title: 'Data Mining', 
    time: 'Tiết 7 -10(12:15)', 
    location: 'P5', 
    instructor: 'GV: T.Q.Việt' 
  },
  { 
    id: '3', 
    title: 'Data Mining', 
    time: 'Tiết 7 -10(12:15)', 
    location: 'P5', 
    instructor: 'GV: T.Q.Việt' 
  },
  { 
    id: '4', 
    title: 'Data Mining', 
    time: 'Tiết 7 -10(12:15)', 
    location: 'P5', 
    instructor: 'GV: T.Q.Việt' 
  },
  { 
    id: '5', 
    title: 'Data Mining', 
    time: 'Tiết 7 -10(12:15)', 
    location: 'P5', 
    instructor: 'GV: T.Q.Việt' 
  },
  { 
    id: '6', 
    title: 'An toàn và bảo mật hệ thống thông tin', 
    time: 'Tiết 4 -7(09:30)', 
    location: 'P3', 
    instructor: 'GV: P.D.Long' 
  },
];
const data = [
  { label: 'Học kỳ 1 Năm học 2023-2024', value: '1' },
  { label: 'Học kỳ 2 Năm học 2023-2024', value: '2' },
];

const Schedule = () => {
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState({});

  const onDayPress = (day) => {
    setSelectedDate({
      [day.dateString]: {
        selected: true,
        selectedColor: 'blue',
      },
    });
  };
  const generateMarkedDates = () => {
    const startDate = moment('2023-11-01');
    const endDate = moment('2023-11-30');
    const markedDates = {};
  
    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      if (m.day() === 0) { 
        markedDates[m.format('YYYY-MM-DD')] = {
          dots: Array(3).fill({ color: 'red' }),
        };
      }
    }
  
    return markedDates;
  };
  
  const markedDates = generateMarkedDates();
  
   return (
    <View  style={{
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
    backgroundColor: 'black',
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
      today: {
        backgroundColor: '#CFE6E6',
      },
      sunday: {
        color: 'red',
        fontWeight: 'bold',
      },
    },
  }}
  
/>
<FlatList 
      data={tasks}
      keyExtractor={item => item.id}
      style={{height: 310}}
      renderItem={({ item }) => (
        
        <View style={{ 
          marginTop: 10,
          width: '100%', 
          height: 66, 
          borderWidth: 1, 
          borderColor: 'black', 
          borderRadius: 10, 
          paddingHorizontal: 10}}>
          
          <Text><Icon name="book-outline" size= {15} color="#000"/>: <Text style={{fontWeight: 'bold'}}>{item.title}</Text></Text>
          <Text><Icon name="alarm-outline" size= {15} color="#000"/>: <Text style={{color: 'red'}}>{item.time}, {item.location}</Text></Text>
          <Text><Icon name="person-outline" size= {15} color="#000"/>: <Text>{item.instructor}</Text></Text>
        </View>
      )}
    />
    </View>
   
  );
};

export default Schedule;

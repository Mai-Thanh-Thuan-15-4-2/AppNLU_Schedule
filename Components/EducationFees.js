import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { getEducationFee } from '../service/NLUApiCaller';
import { loadPage } from '../BaseStyle/Style';

const EducationFees = () => {

  const [feesData, setfeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchfeesData = async () => {

      setIsLoading(true)
      const data = await getEducationFee();
      if (data.length > 0) {
        setfeesData(data);
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

    fetchfeesData();
 
  }, []);

// Tính tổng HP
  const getTotalTuitionFee = () => {
    return feesData.reduce((total, item) => total + parseFloat(item.fee), 0);
  };

  const createTotalItem = () => {
    const totalTuitionFee = getTotalTuitionFee();
    return {
      semesterName: 'Tổng cộng',
      fee: totalTuitionFee,
      reduce: 0,
      mustGet: 0,
      got: 0,
      dept: 0,
    };
  };

  const renderItem = ({ item, index }) => (
    <ListItem containerStyle={styles.listItem}>
      <ListItem.Content>
        <View style={styles.semesterContainer}>
          <Text style={styles.semesterText}>{item.semesterName}</Text>
        </View>
        <View style={styles.feeContainer}>
          <Text style={[styles.feeText, styles.leftBorder, styles.bottomBorder, styles.topBorder]}>HP: {formatCurrency(item.fee)}</Text>
          <Text style={[styles.feeText, styles.rightBorder, styles.bottomBorder, styles.topBorder]}>Miễn giảm: {formatCurrency(item.reduce)}</Text>
          <Text style={[styles.feeText, styles.leftBorder, styles.bottomBorder]}>HP phải thu: {formatCurrency(item.mustGet)}</Text>
          <Text style={[styles.feeText, styles.rightBorder, styles.bottomBorder]}>HP đã thu: {formatCurrency(item.got)}</Text>
          <Text style={[styles.feeText, styles.remainingBalanceText]}>
            Còn nợ: {formatCurrency(item.dept)}
          </Text>
        </View>
      </ListItem.Content>
    </ListItem>

  );


  const formatCurrency = (value) => {
    value = parseFloat(value)
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toLocaleString('vi-VN'); // Đổi ngôn ngữ nếu cần
    } else {
      return 'Invalid value';
    }
  };
  

  return (
    <View>
      <FlatList
        data={[...feesData, createTotalItem()]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      {isLoading ? (
        <View style={loadPage.loadingContainer}>
          <ActivityIndicator size="large" color="#2bc250" />
        </View>) : (<></>)
      }
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff', // Màu nền của ListItem
    borderWidth: 1, // Độ rộng đường viền
    borderColor: '#ddd', // Màu đường viền
  },
  semesterContainer: {
    marginBottom: 10,
  },
  semesterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  feeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feeText: {
    width: '50%', // Hiển thị 2 cột
    marginBottom: 5,
    padding: 10, // Khoảng cách giữa nội dung và đường viền
  },
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  leftBorder: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  rightBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  remainingBalanceText: {
    fontWeight: 'bold',
    color: 'red', // Màu cho "Còn nợ"
  },

});

export default EducationFees;

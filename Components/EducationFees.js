import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

const EducationFees = () => {
  const feesData = [
    {
      semester: 'Học kì 1 năm 2023-2024',
      tuitionFee: 1000000,
      discount: 200000,
      dueFee: 800000,
      paidFee: 600000,
      remainingBalance: 0,
    },
    {
      semester: 'Học kì 1 năm 2023-2024',
      tuitionFee: 1000000,
      discount: 200000,
      dueFee: 800000,
      paidFee: 600000,
      remainingBalance: 0,
    },
    // Thêm các mục khác tương tự ở đây
  ];

  const renderItem = ({ item, index }) => (
    <ListItem containerStyle={styles.listItem}>
      <ListItem.Content>
        <View style={styles.semesterContainer}>
          <Text style={styles.semesterText}>{item.semester}</Text>
        </View>
        <View style={styles.feeContainer}>
          <Text style={[styles.feeText, styles.leftBorder, styles.bottomBorder, styles.topBorder]}>HP chưa giảm: {item.tuitionFee}</Text>
          <Text style={[styles.feeText, styles.rightBorder, styles.bottomBorder, styles.topBorder]}>Miễn giảm: {item.discount}</Text>
          <Text style={[styles.feeText, styles.leftBorder, styles.bottomBorder]}>HP phải thu: {item.dueFee}</Text>
          <Text style={[styles.feeText, styles.rightBorder, styles.bottomBorder]}>HP đã thu: {item.paidFee}</Text>
          <Text style={[styles.feeText, styles.remainingBalanceText]}>
            Còn nợ: {item.remainingBalance}
          </Text>
        </View>
      </ListItem.Content>
    </ListItem>
  );

  // Tính tổng HP
  const totalTuitionFee = feesData.reduce((total, item) => total + item.tuitionFee, 0);

  // Thêm item tổng cộng
  feesData.push({
    semester: 'Tổng cộng',
    tuitionFee: totalTuitionFee,
    discount: 0,
    dueFee: 0,
    paidFee: 0,
    remainingBalance: 0,
  });

  return (
    <View>
      <FlatList
        data={feesData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
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
